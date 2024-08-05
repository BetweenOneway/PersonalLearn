const express=require("express");
const crypto = require("crypto")
const redis = require('redis')
const stringRandom = require("string-random");
const { Op } = require("sequelize");

//数据库
var sqldb = require('../sqldb');

let statusCode = require("./statusCode")
let validate = require("../utils/validate")

var router=express.Router();

//获取用户所有正常的便签
/**
 * userToken 用户编号
 * searchText 搜索关键词（标题含有 或者标签含有)
 * filter 过滤 null 默认 0 只查询未完成 1 只查询已完成
 */
router.get("/getUserMemoList",async (req,res)=>{
    var output={
        success:true,
        status:'',
        description:'',
        data:[]
    }

    console.log("start getMemoList",req.query)
    var userToken = req.query.userToken
    const searchText = req.query.searchText;
    const filter = req.query.filter;
    let status = 1
    let userInfo = {}

    try {
        //验证用户是否登录
        let validateInfo = await validate.IsUserValidate(userToken);
        if(!validateInfo.isValidated)
        {
            console.log("用户登录状态无效"+validateInfo.isValidated)
            output.success = statusCode.SERVICE_STATUS.NOT_LOGIN.success
            output.status = statusCode.SERVICE_STATUS.NOT_LOGIN.status
            output.description = statusCode.SERVICE_STATUS.NOT_LOGIN.description
            res.send(output)
            return
        }
        userInfo = validateInfo.userInfo
        console.log("parsed userinfo")
        console.log(userInfo)
        //组合查询条件
        let condition = {};
        condition['status'] = status;
        condition['u_id'] = userInfo.id;
        if(filter != null)
        {
            condition['finished'] = filter;
        }
        if(!!searchText)
        {
            condition[Op.or]=[
                {
                    tags: {
                    [Op.like]: `%${searchText}%`
                    }
                },
                {
                    content: {
                    [Op.like]: `%${searchText}%`
                    }
                }
            ]
        }

        //置顶在前 未完成在前 时间越近的越在前
        const users = await sqldb.Memo.findAll(
            {
                attributes: ['id', 'title','top','tags','update_time','finished'],
                where:condition,
                order:[
                    ['id', 'DESC'],
                    ['finished', 'ASC'],
                    ['update_time','DESC']
                ]
            }
        );
        output.success = statusCode.SERVICE_STATUS.GET_MEMO_SUCCESS.success
        output.status = statusCode.SERVICE_STATUS.GET_MEMO_SUCCESS.status
        output.description = statusCode.SERVICE_STATUS.GET_MEMO_SUCCESS.description
        output.data = users
        res.send(output);
    } catch (error) {
        console.log(error)
        output.success = statusCode.DB_STATUS.SELECT_FAIL.success
        output.status = statusCode.DB_STATUS.SELECT_FAIL.status
        output.description = statusCode.DB_STATUS.SELECT_FAIL.description
        res.send(output);
    }
    console.log("End of get User's Memo List")
    return;
})

//置顶 取消置顶
/**
 * 
 */
router.get("/setMemoTop",async (req,res)=>{
    let output={
        success:true,
        status:'',
        description:'',
        data:[]
    }
    console.log("start set Top:",req.query);
    
    //目标状态
    let targetTop = req.query.targetTop
    let memoId = req.query.memoId
    let userToken = req.query.userToken
    if(0 == userToken.length)
    {
        console.log("memo set top, userToken empty")
        output.success = statusCode.REDIS_STATUS.PARAM_ERROR.success
        output.status = statusCode.REDIS_STATUS.PARAM_ERROR.status
        output.description = statusCode.REDIS_STATUS.PARAM_ERROR.description
        res.send(output)
        return
    }

    //验证用户是否登陆
    let validateInfo = await validate.IsUserValidate(userToken);
    if(!validateInfo.isValidated)
    {
        output.success = statusCode.SERVICE_STATUS.NOT_LOGIN.success
        output.status = statusCode.SERVICE_STATUS.NOT_LOGIN.status
        output.description = statusCode.SERVICE_STATUS.NOT_LOGIN.description
        res.send(output)
        return
    }

    let userInfo = validateInfo.userInfo;
    let sql = `UPDATE z_thing SET \`top\` =? WHERE \`id\` = ? AND \`u_id\` = ? AND \`top\` != ? AND \`status\` = 1;`

    const t = await sqldb.sequelize.transaction();

    try{
        const updateNum = await sqldb.Memo.update(
            {
                top:targetTop
            },
            {
                where:{
                    id:memoId,
                    u_id:userInfo.id,
                    top:{
                        [Op.ne]: targetTop
                    },
                    status:1
                },
                transaction: t
            }
        );
        if(updateNum > 0)
        {
            var date = new Date().toLocaleString();
            let event = targetTop === 1? statusCode.EVENT_LIST.MEMO_SET_TOP : statusCode.EVENT_LIST.MEMO_UNSET_TOP;
            
            const newAddedLog = await sqldb.NoteMemoLog.create(
                {
                    time: date,
                    event: event.code,
                    desc:event.desc,
                    u_id:userInfo.id,
                    t_id:memoId
                }, 
                { 
                    transaction: t 
                }
            )
            t.commit();
            output.success = statusCode.SERVICE_STATUS.MEMO_SET_TOP_SUCCESS.success
            output.status = statusCode.SERVICE_STATUS.MEMO_SET_TOP_SUCCESS.status
            output.description = statusCode.SERVICE_STATUS.MEMO_SET_TOP_SUCCESS.description
            res.send(output);
        }
        else{
            console.log("set memo top,updateNum=",updateNum);
            t.rollback()
            output.success = statusCode.SERVICE_STATUS.MEMO_SET_TOP_FAIL.success
            output.status = statusCode.SERVICE_STATUS.MEMO_SET_TOP_FAIL.status
            output.description = statusCode.SERVICE_STATUS.MEMO_SET_TOP_FAIL.description
            res.send(output);
        }
    }
    catch(e){
        console.log(e)
        t.rollback()
        output.success = statusCode.SERVICE_STATUS.MEMO_SET_TOP_FAIL.success
        output.status = statusCode.SERVICE_STATUS.MEMO_SET_TOP_FAIL.status
        output.description = statusCode.SERVICE_STATUS.MEMO_SET_TOP_FAIL.description
        res.send(output);
    }
    console.log("End of set memo top");
    return
})

//删除便签
/**
 * 
 */
router.delete("/deleteMemo",async (req,res)=>{
    let output={
        success:true,
        status:'',
        description:'',
        data:[]
    }
    console.log("start del memo,req.query:",req.query);

    //目标状态
    let isCompleteDel = req.query.isCompleteDel.toLowerCase() === 'true'
    let memoId = req.query.memoId
    let userToken = req.query.userToken
    if(0 == userToken.length)
    {
        console.log("del memo, userToken empty")
        output.success = statusCode.REDIS_STATUS.PARAM_ERROR.success
        output.status = statusCode.REDIS_STATUS.PARAM_ERROR.status
        output.description = statusCode.REDIS_STATUS.PARAM_ERROR.description
        res.send(output)
        return
    }

    //验证用户是否登陆
    let validateInfo = await validate.IsUserValidate(userToken);
    if(!validateInfo.isValidated)
    {
        output.success = statusCode.SERVICE_STATUS.NOT_LOGIN.success
        output.status = statusCode.SERVICE_STATUS.NOT_LOGIN.status
        output.description = statusCode.SERVICE_STATUS.NOT_LOGIN.description
        res.send(output)
        return
    }

    const t = await sqldb.sequelize.transaction();
    try {
        let userInfo = validateInfo.userInfo;
        let curTime = new Date().toLocaleString()
        let targetStatus = isCompleteDel? -1:0

        const updateNum = await sqldb.Memo.update(
            {
                status:targetStatus,
                update_time:curTime
            },
            {
                where:{
                    id:memoId,
                    u_id:userInfo.id,
                    status:{
                        [Op.ne]:targetStatus
                    }
                },
                transaction:t
            }
        );
        if(updateNum>0)
        {
            let event = isCompleteDel? statusCode.EVENT_LIST.MEMO_COMPEL_DEL : statusCode.EVENT_LIST.MEMO_DEL;
            const users = await sqldb.NoteMemoLog.create(
                {
                    time:curTime,
                    event:event.code,
                    desc:event.desc,
                    u_id:userInfo.id,
                    t_id:memoId,
                },
                {
                    transaction:t
                }
            );

            t.commit();
            output.success = statusCode.SERVICE_STATUS.DEL_MEMO_SUCCESS.success
            output.status = statusCode.SERVICE_STATUS.DEL_MEMO_SUCCESS.status
            output.description = statusCode.SERVICE_STATUS.DEL_MEMO_SUCCESS.description
            res.send(output);
        }
        else{
            console.log("Delete memo:updateNum=",updateNum);
            t.rollback();
            output.success = statusCode.SERVICE_STATUS.DEL_MEMO_FAIL.success
            output.status = statusCode.SERVICE_STATUS.DEL_MEMO_FAIL.status
            output.description = statusCode.SERVICE_STATUS.DEL_MEMO_FAIL.description
            res.send(output);
        }
    } catch (error) {
        console.log(error)

        t.rollback();
        output.success = statusCode.SERVICE_STATUS.DEL_MEMO_FAIL.success
        output.status = statusCode.SERVICE_STATUS.DEL_MEMO_FAIL.status
        output.description = statusCode.SERVICE_STATUS.DEL_MEMO_FAIL.description
        res.send(output);
    }
    console.log("End of delete memo")
    return
})

//新增便签
/**
 * userToken 用户编号
 * title 标题
 * tags 标签
 * content 内容
 * finished 是否已完成
 * top是否置顶
 */
router.put("/addMemo",async (req,res)=>{
    console.log(req.body);

    let output={
        success:false,
        status:"",
        description:""
    }
    let inputInfo = {}
    inputInfo.userToken = req.body.userToken
    inputInfo.title = req.body.title
    inputInfo.tags = req.body.tags
    inputInfo.content = req.body.content
    inputInfo.finished = req.body.finished
    inputInfo.top = req.body.top

    if(inputInfo.userToken == undefined || 0 == inputInfo.userToken.length)
    {
        console.log("Add memo, userToken empty")
        output.success = statusCode.REDIS_STATUS.PARAM_ERROR.success
        output.status = statusCode.REDIS_STATUS.PARAM_ERROR.status
        output.description = statusCode.REDIS_STATUS.PARAM_ERROR.description
        res.send(output)
        return
    }

    //验证用户是否登陆
    let validateInfo = await validate.IsUserValidate(inputInfo.userToken);
    if(!validateInfo.isValidated)
    {
        console.log("Add memo,user info invalidated")
        output.success = statusCode.SERVICE_STATUS.NOT_LOGIN.success
        output.status = statusCode.SERVICE_STATUS.NOT_LOGIN.status
        output.description = statusCode.SERVICE_STATUS.NOT_LOGIN.description
        res.send(output)
        return
    }

    const t = await sqldb.sequelize.transaction();

    try {
        let userInfo = validateInfo.userInfo;
        let curTime = new Date().toLocaleString()

        const newAddMemo = await sqldb.Memo.create(
            {
                title:inputInfo.title,
                tags:inputInfo.tags,
                content:inputInfo.content,
                u_id:userInfo.id,
                finished:inputInfo.finished,
                time:curTime,
                top:inputInfo.top,
                status:1,
                type:2
            },
            {
                transaction:t
            }
        );

        let event = statusCode.EVENT_LIST.ADD_MEMO;
        const addLog = await sqldb.NoteMemoLog.create(
            {
                time:curTime,
                event:event.code,
                desc:event.desc,
                u_id:userInfo.id,
                t_id:newAddMemo.id
            },
            {
                transaction:t
            }
        );

        t.commit();
        console.log("add memo success,commit database success")
        output.success = statusCode.SERVICE_STATUS.ADD_MEMO_SUCCESS.success
        output.status = statusCode.SERVICE_STATUS.ADD_MEMO_SUCCESS.status
        output.description = statusCode.SERVICE_STATUS.ADD_MEMO_SUCCESS.description
        res.send(output);
    } catch (error) {
        console.log(error)
        t.rollback();
        output.success = statusCode.SERVICE_STATUS.ADD_MEMO_FAIL.success
        output.status = statusCode.SERVICE_STATUS.ADD_MEMO_FAIL.status
        output.description = statusCode.SERVICE_STATUS.ADD_MEMO_FAIL.description
        res.send(output);
    }

    console.log("End of add memo")
    return
})

//获取便签信息
/**
 * memoId 便签编号
 * userToken 用户
 */
router.get("/getMemoInfo",async (req,res)=>{
    let output={
        success:true,
        status:'',
        description:'',
        data:{}
    }
    console.log("start Get Memeo Info:",req.query);
    
    //目标状态
    let memoId = req.query.memoId
    let userToken = req.query.userToken
    if(0 == userToken.length)
    {
        console.log("Get Memo Info, userToken empty")
        output.success = statusCode.REDIS_STATUS.PARAM_ERROR.success
        output.status = statusCode.REDIS_STATUS.PARAM_ERROR.status
        output.description = statusCode.REDIS_STATUS.PARAM_ERROR.description
        res.send(output)
        return
    }

    //验证用户是否登陆
    let validateInfo = await validate.IsUserValidate(userToken);
    if(!validateInfo.isValidated)
    {
        output.success = statusCode.SERVICE_STATUS.NOT_LOGIN.success
        output.status = statusCode.SERVICE_STATUS.NOT_LOGIN.status
        output.description = statusCode.SERVICE_STATUS.NOT_LOGIN.description
        res.send(output)
        return
    }

    let userInfo = validateInfo.userInfo;

    try {
        const memo = await sqldb.Memo.findOne(
            {
                attributes: ['title', 'top','tags','content'],
                where: {
                    id: memoId,
                    u_id:userInfo.id,
                    status:1
                }
            }
        );
        output.success = statusCode.SERVICE_STATUS.GET_MEMO_SUCCESS.success
        output.status = statusCode.SERVICE_STATUS.GET_MEMO_SUCCESS.status
        output.description = statusCode.SERVICE_STATUS.GET_MEMO_SUCCESS.description
        output.data = memo;
        res.send(output);
    } catch (error) {
        console.log(error);
        output.success = statusCode.SERVICE_STATUS.COMMON_EXCEPTION.success
        output.status = statusCode.SERVICE_STATUS.COMMON_EXCEPTION.status
        output.description = statusCode.SERVICE_STATUS.COMMON_EXCEPTION.description
        res.send(output);
    }
    console.log("End GetMemoInfo");
    return
})

//修改便签
/**
 * userToken 用户编号
 * memoId 便签编号
 * title 标题
 * tags 标签
 * content 内容
 * finished 是否已完成
 * top是否置顶
 */
router.post("/updateMemo",async (req,res)=>{
    console.log("start update Memo :",req.body);

    let output={
        success:false,
        status:"",
        description:""
    }

    let inputInfo = {}
    inputInfo.userToken = req.body.userToken
    inputInfo.memoId = req.body.memoId
    inputInfo.title = req.body.title
    inputInfo.tags = req.body.tags
    inputInfo.content = req.body.content
    inputInfo.finished = req.body.finished
    inputInfo.top = req.body.top

    if(inputInfo.userToken === undefined || 0 == inputInfo.userToken.length || inputInfo.memoId.length == 0)
    {
        console.log("update memo, userToken or memoId empty")
        output.success = statusCode.REDIS_STATUS.PARAM_ERROR.success
        output.status = statusCode.REDIS_STATUS.PARAM_ERROR.status
        output.description = statusCode.REDIS_STATUS.PARAM_ERROR.description
        res.send(output)
        return
    }

    //验证用户是否登陆
    let validateInfo = await validate.IsUserValidate(inputInfo.userToken);
    if(!validateInfo.isValidated)
    {
        output.success = statusCode.SERVICE_STATUS.NOT_LOGIN.success
        output.status = statusCode.SERVICE_STATUS.NOT_LOGIN.status
        output.description = statusCode.SERVICE_STATUS.NOT_LOGIN.description
        res.send(output)
        return
    }

    const t = await sqldb.sequelize.transaction();

    try {
        let userInfo = validateInfo.userInfo;
        let curTime = new Date().toLocaleString()

        const targetMemo = sqldb.Memo.findOne(
            {
                where: {
                    id: inputInfo.memoId,
                    u_id:userInfo.id,
                    status:1
                }
            }
        )
        if(targetMemo !== undefined)
        {
            //更新便签
            const updateNum = await sqldb.Memo.update(
                {
                    title:inputInfo.title,
                    tags:inputInfo.tags,
                    content:inputInfo.content,
                    finished:inputInfo.finished,
                    update_time:curTime,
                    top:inputInfo.top,
                },
                {
                    where:{
                        id: inputInfo.memoId,
                        u_id:userInfo.id,
                        status:1
                    },
                    transaction:t
                }
            );
            //记录日志
            let event = statusCode.EVENT_LIST.UPDATE_MEMO;
            const addLog = await sqldb.NoteMemoLog.create(
                {
                    time:curTime,
                    event:event.code,
                    desc:event.desc,
                    u_id:userInfo.id,
                    t_id:inputInfo.memoId
                },
                {
                    transaction:t
                }
            );

            t.commit();
            console.log("update memo success,commit database success")
            output.success = statusCode.SERVICE_STATUS.UPDATE_MEMO_SUCCESS.success
            output.status = statusCode.SERVICE_STATUS.UPDATE_MEMO_SUCCESS.status
            output.description = statusCode.SERVICE_STATUS.UPDATE_MEMO_SUCCESS.description
            res.send(output);
        }

        
    } catch (error) {
        console.log(error);
        t.rollback();
        output.success = statusCode.SERVICE_STATUS.UPDATE_MEMO_FAIL.success
        output.status = statusCode.SERVICE_STATUS.UPDATE_MEMO_FAIL.status
        output.description = statusCode.SERVICE_STATUS.UPDATE_MEMO_FAIL.description
        res.send(output);
    }
    console.log("End of Update memo");
    return
})

module.exports=router;