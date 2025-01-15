const express=require("express");
const crypto = require("crypto")
const redis = require('redis')
const { Op } = require("sequelize");

//数据库
var sqldb = require('../sqldb');

let statusCode = require("./statusCode")
let validate = require("../utils/validate");
const note = require("../models/note");

var router=express.Router();

/**
 * 获取用户笔记本列表
 * userToken 用户编号
 */
router.get("/getUserNotebookList",async (req,res)=>{
    var output={
        success:true,
        status:'',
        description:'',
        data:[]
    }

    console.log("start get user notebook list")
    
    var userToken = req.get('userToken')
    
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
        let userInfo = validateInfo.userInfo
        console.log("parsed userinfo=>",userInfo)

        const notes = await sqldb.Notebook.findAll(
            {
                attributes: ['id', 'name','level','parent_id'],
                where:{
                    u_id:userInfo.id
                },
                order:[
                    ['level', 'DESC']
                ],
                raw:true,
            }
        );
        output.success = statusCode.SERVICE_STATUS.GET_NOTEBOOK_SUCCESS.success
        output.status = statusCode.SERVICE_STATUS.GET_NOTEBOOK_SUCCESS.status
        output.description = statusCode.SERVICE_STATUS.GET_NOTEBOOK_SUCCESS.description

        output.data = notes
        res.send(output);
    } catch (error) {
        console.log(error)
        output.success = statusCode.SERVICE_STATUS.GET_NOTEBOOK_FAIL.success
        output.status = statusCode.SERVICE_STATUS.GET_NOTEBOOK_FAIL.status
        output.description = statusCode.SERVICE_STATUS.GET_NOTEBOOK_FAIL.description
        res.send(output);
    }
    console.log("End of get user notebook list")
    return;
})

/**
 * 新增笔记本
 * userToken 用户编号
 * parentId 父级菜单ID
 * notebookName 笔记本名称
 */
router.post("/addNotebook",async (req,res)=>{
    console.log("start add notebook:",req.body);

    let output={
        success:false,
        status:"",
        description:"",
        data:{
            update_time:''
        }
    }

    let inputInfo = {}
    inputInfo.notebookName = req.body.notebookName
    inputInfo.parentId = req.body.parentId

    const t = await sqldb.sequelize.transaction();

    try {
        console.log("userInfo:",req.userInfo);
        let userInfo = req.userInfo;
        let curTime = new Date().toLocaleString()

        const newAddNotebook = await sqldb.Notebook.create(
            {
                name:inputInfo.notebookName,
                parentId:inputInfo.parentId,
                u_id:userInfo.id,
                time:curTime,
                update_time:curTime,
                status:1,
            },
            {
                transaction:t
            }
        );
        console.log("new added notebook info:",newAddNotebook);
        let event = statusCode.EVENT_LIST.ADD_NOTE;
        const addLog = await sqldb.operLog.create(
            {
                time:curTime,
                event:event.code,
                desc:event.desc,
                u_id:userInfo.id,
                o_id:newAddNotebook.id,
                type:1
            },
            {
                transaction:t
            }
        );

        t.commit();
        console.log("add notebook success,commit database success")
        output.success = statusCode.SERVICE_STATUS.ADD_NOTE_SUCCESS.success
        output.status = statusCode.SERVICE_STATUS.ADD_NOTE_SUCCESS.status
        output.description = statusCode.SERVICE_STATUS.ADD_NOTE_SUCCESS.description
        output.data.noteId = newAddNote.id
        res.send(output);
    } catch (error) {
        console.log("add notebook error:",error);
        t.rollback();
        output.success = statusCode.SERVICE_STATUS.UPDATE_NOTE_FAIL.success
        output.status = statusCode.SERVICE_STATUS.UPDATE_NOTE_FAIL.status
        output.description = statusCode.SERVICE_STATUS.UPDATE_NOTE_FAIL.description
        res.send(output);
    }
    console.log("End of add notebook");
    return
})

/**
 * 笔记本重命名
 * userToken 用户编号
 * id 目标笔记本ID
 * newName 笔记本新名称
 */
router.post("/renameNotebook",async (req,res)=>{
    console.log("start rename notebook :",req.body);

    let output={
        success:false,
        status:"",
        description:"",
        data:{
            update_time:''
        }
    }

    let inputInfo = {}
    inputInfo.id = req.body.id
    inputInfo.newName = req.body.title

    const t = await sqldb.sequelize.transaction();

    try {
        console.log("userInfo:",req.userInfo);
        let userInfo = req.userInfo;
        let curTime = new Date().toLocaleString()

        const targetNote = sqldb.Notebook.findOne(
            {
                where: {
                    id: inputInfo.id,
                    u_id:userInfo.id,
                    status:1
                }
            }
        )
        if(targetNote !== undefined)
        {
            //更新
            const updateNum = await sqldb.Notebook.update(
                {
                    name:inputInfo.newName,
                    update_time:curTime,
                },
                {
                    where:{
                        id: inputInfo.id,
                        u_id:userInfo.id,
                        status:1
                    },
                    transaction:t
                }
            );
            //记录日志
            let event = statusCode.EVENT_LIST.UPDATE_NOTE;
            const addLog = await sqldb.operLog.create(
                {
                    time:curTime,
                    event:event.code,
                    desc:event.desc,
                    u_id:userInfo.id,
                    o_id:inputInfo.id,
                    type:1
                },
                {
                    transaction:t
                }
            );

            t.commit();
            console.log("rename notebook success,commit database success")
            output.success = statusCode.SERVICE_STATUS.UPDATE_NOTE_SUCCESS.success
            output.status = statusCode.SERVICE_STATUS.UPDATE_NOTE_SUCCESS.status
            output.description = statusCode.SERVICE_STATUS.UPDATE_NOTE_SUCCESS.description;
            output.data.update_time = curTime;
            res.send(output);
        }
    } catch (error) {
        console.log("rename notebook error:",error);
        t.rollback();
        output.success = statusCode.SERVICE_STATUS.UPDATE_NOTE_FAIL.success
        output.status = statusCode.SERVICE_STATUS.UPDATE_NOTE_FAIL.status
        output.description = statusCode.SERVICE_STATUS.UPDATE_NOTE_FAIL.description
        res.send(output);
    }
    console.log("End of rename notebook");
    return
})
module.exports=router;