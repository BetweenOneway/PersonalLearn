const express=require("express");
const crypto = require("crypto")
const redis = require('redis')
const { Op } = require("sequelize");

//数据库
var sqldb = require('../sqldb');

let statusCode = require("./statusCode")
let validate = require("../utils/validate")

var router=express.Router();

//获取用户笔记列表
/**
 * userToken 用户编号
 */
router.get("/getUserNoteList",async (req,res)=>{
    var output={
        success:true,
        status:'',
        description:'',
        data:[]
    }

    console.log("start getUserNoteList",req.query)
    var userToken = req.query.userToken
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

        const notes = await sqldb.Note.findAll(
            {
                attributes: ['id', 'title','body','top','update_time'],
                where:{
                    status: status,
                    u_id:userInfo.id
                },
                order:[
                    ['top', 'DESC'],
                    ['update_time','DESC']
                ]
            }
        );
        output.success = statusCode.SERVICE_STATUS.GET_NOTE_SUCCESS.success
        output.status = statusCode.SERVICE_STATUS.GET_NOTE_SUCCESS.status
        output.description = statusCode.SERVICE_STATUS.GET_NOTE_SUCCESS.description
        output.data = notes
        res.send(output);
    } catch (error) {
        console.log(error)
        output.success = statusCode.SERVICE_STATUS.GET_NOTE_FAIL.success
        output.status = statusCode.SERVICE_STATUS.GET_NOTE_FAIL.status
        output.description = statusCode.SERVICE_STATUS.GET_NOTE_FAIL.description
        res.send(output);
    }
    console.log("End of getUserNoteList")
    return;
})

//置顶 取消置顶
/**
 * 
 */
router.get("/setNoteTop",async (req,res)=>{
    let output={
        success:true,
        status:'',
        description:'',
        data:[]
    }
    console.log("start set Note Top:",req.query);
    
    //目标状态
    let targetTop = req.query.targetTop
    let noteId = req.query.noteId
    let userToken = req.query.userToken

    if(!userToken.length || !noteId || targetTop ===undefined || 0!= targetTop || 1!= targetTop)
    {
        console.log("note set top, userToken or noteId or targetTop empty")
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

    const t = await sqldb.sequelize.transaction();

    try{
        let curTime = new Date().toLocaleString()
        const updateNum = await sqldb.Note.update(
            {
                top:targetTop,
                update_time:curTime
            },
            {
                where:{
                    id:noteId,
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
            let event = targetTop === 1? statusCode.EVENT_LIST.NOTE_SET_TOP : statusCode.EVENT_LIST.NOTE_UNSET_TOP;
            
            const newAddedLog = await sqldb.NoteMemoLog.create(
                {
                    time: curTime,
                    event: event.code,
                    desc:event.desc,
                    u_id:userInfo.id,
                    t_id:noteId
                }, 
                { 
                    transaction: t 
                }
            )
            t.commit();
            output.success = statusCode.SERVICE_STATUS.NOTE_SET_TOP_SUCCESS.success
            output.status = statusCode.SERVICE_STATUS.NOTE_SET_TOP_SUCCESS.status
            output.description = statusCode.SERVICE_STATUS.NOTE_SET_TOP_SUCCESS.description
            res.send(output);
        }
        else{
            console.log("set note top,updateNum=",updateNum);
            t.rollback()
            output.success = statusCode.SERVICE_STATUS.NOTE_SET_TOP_FAIL.success
            output.status = statusCode.SERVICE_STATUS.NOTE_SET_TOP_FAIL.status
            output.description = statusCode.SERVICE_STATUS.NOTE_SET_TOP_FAIL.description
            res.send(output);
        }
    }
    catch(e){
        console.log(e)
        t.rollback()
        output.success = statusCode.SERVICE_STATUS.NOTE_SET_TOP_FAIL.success
        output.status = statusCode.SERVICE_STATUS.NOTE_SET_TOP_FAIL.status
        output.description = statusCode.SERVICE_STATUS.NOTE_SET_TOP_FAIL.description
        res.send(output);
    }
    console.log("End of set note top or untop");
    return
})

//删除笔记
/**
 * 
 */
router.delete("/deleteNote",async (req,res)=>{
    let output={
        success:true,
        status:'',
        description:'',
        data:[]
    }
    console.log("start del note,req.query:",req.query);

    //目标状态
    let isCompleteDel = req.query.isCompleteDel.toLowerCase() === 'true'
    let noteId = req.query.noteId
    let userToken = req.query.userToken
    if(0 == userToken.length)
    {
        console.log("del note, userToken empty")
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

        const updateNum = await sqldb.Note.update(
            {
                status:targetStatus,
                update_time:curTime
            },
            {
                where:{
                    id:noteId,
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
            let event = isCompleteDel? statusCode.EVENT_LIST.NOTE_COMPEL_DEL : statusCode.EVENT_LIST.NOTE_DEL;
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
            output.success = statusCode.SERVICE_STATUS.DEL_NOTE_SUCCESS.success
            output.status = statusCode.SERVICE_STATUS.DEL_NOTE_SUCCESS.status
            output.description = statusCode.SERVICE_STATUS.DEL_NOTE_SUCCESS.description
            res.send(output);
        }
        else{
            console.log("Delete note:updateNum=",updateNum);
            t.rollback();
            output.success = statusCode.SERVICE_STATUS.DEL_NOTE_FAIL.success
            output.status = statusCode.SERVICE_STATUS.DEL_NOTE_FAIL.status
            output.description = statusCode.SERVICE_STATUS.DEL_NOTE_FAIL.description
            res.send(output);
        }
    } catch (error) {
        console.log(error)

        t.rollback();
        output.success = statusCode.SERVICE_STATUS.DEL_NOTE_FAIL.success
        output.status = statusCode.SERVICE_STATUS.DEL_NOTE_FAIL.status
        output.description = statusCode.SERVICE_STATUS.DEL_NOTE_FAIL.description
        res.send(output);
    }
    console.log("End of delete note")
    return
})

//新增笔记
/**
 * userToken 用户信息
 */
router.put("/createNote",async (req,res)=>{
    console.log(req.body);

    let output={
        success:false,
        status:"",
        description:"",
        data:{}
    }
    let inputInfo = {}
    inputInfo.userToken = req.body.userToken

    if(!inputInfo.userToken)
    {
        console.log("Add note, userToken empty")
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

        const newAddNote = await sqldb.Note.create(
            {
                u_id:userInfo.id,
                time:curTime,
                status:1,
                type:1
            },
            {
                transaction:t
            }
        );

        let event = statusCode.EVENT_LIST.ADD_NOTE;
        const addLog = await sqldb.NoteMemoLog.create(
            {
                time:curTime,
                event:event.code,
                desc:event.desc,
                u_id:userInfo.id,
                t_id:newAddNote.id
            },
            {
                transaction:t
            }
        );

        t.commit();
        console.log("add note success,commit database success")
        output.success = statusCode.SERVICE_STATUS.ADD_NOTE_SUCCESS.success
        output.status = statusCode.SERVICE_STATUS.ADD_NOTE_SUCCESS.status
        output.description = statusCode.SERVICE_STATUS.ADD_NOTE_SUCCESS.description
        output.data.noteId = newAddNote.id
        res.send(output);
    } catch (error) {
        console.log(error)
        t.rollback();
        output.success = statusCode.SERVICE_STATUS.ADD_NOTE_FAIL.success
        output.status = statusCode.SERVICE_STATUS.ADD_NOTE_FAIL.status
        output.description = statusCode.SERVICE_STATUS.ADD_NOTE_FAIL.description
        res.send(output);
    }

    console.log("End of add note")
    return
})

//获取笔记信息
/**
 * noteId 笔记编号
 * userToken 用户
 */
router.get("/getNoteInfo",async (req,res)=>{
    let output={
        success:true,
        status:'',
        description:'',
        data:{}
    }
    console.log("start Get Note detail Info:",req.query);
    
    //目标状态
    let noteId = req.query.noteId
    let userToken = req.query.userToken
    if(!userToken.length || !noteId)
    {
        console.log("Get Note Info, userToken or noteId empty")
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
        const noteInfo = await sqldb.Note.findOne(
            {
                attributes: ['update_time', 'content','title'],
                where: {
                    id: noteId,
                    u_id:userInfo.id,
                    status:1
                }
            }
        );
        if(noteInfo == null)
        {
            console.log("笔记获取失败，请稍后再试");
            output.success = statusCode.SERVICE_STATUS.GET_NOTE_FAIL.success
            output.status = statusCode.SERVICE_STATUS.GET_NOTE_FAIL.status
            output.description = statusCode.SERVICE_STATUS.GET_NOTE_FAIL.description
        }
        else{
            output.success = statusCode.SERVICE_STATUS.GET_NOTE_SUCCESS.success
            output.status = statusCode.SERVICE_STATUS.GET_NOTE_SUCCESS.status
            output.description = statusCode.SERVICE_STATUS.GET_NOTE_SUCCESS.description
            output.data = noteInfo;
        }
        res.send(output);
    } catch (error) {
        console.log(error);
        output.success = statusCode.SERVICE_STATUS.COMMON_EXCEPTION.success
        output.status = statusCode.SERVICE_STATUS.COMMON_EXCEPTION.status
        output.description = statusCode.SERVICE_STATUS.COMMON_EXCEPTION.description
        res.send(output);
    }
    console.log("End Get Note Info");
    return
})


module.exports=router;