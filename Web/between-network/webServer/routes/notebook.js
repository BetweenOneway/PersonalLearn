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
 * 保存（更新）笔记
 * userToken 用户编号
 * parentId 父级菜单ID
 * notebookName 笔记本名称
 */
router.post("/addNewNotebook",async (req,res)=>{
    console.log("start add new notebook :",req.body);

    let output={
        success:false,
        status:"",
        description:"",
        data:{
            update_time:''
        }
    }

    let inputInfo = {}
    inputInfo.noteId = req.body.noteId
    inputInfo.title = req.body.title
    inputInfo.content = req.body.content

    const t = await sqldb.sequelize.transaction();

    try {
        console.log("userInfo:",req.userInfo);
        let userInfo = req.userInfo;
        let curTime = new Date().toLocaleString()

        const targetNote = sqldb.Note.findOne(
            {
                where: {
                    id: inputInfo.noteId,
                    u_id:userInfo.id,
                    status:1
                }
            }
        )
        if(targetNote !== undefined)
        {
            //更新便签
            const updateNum = await sqldb.Note.update(
                {
                    title:inputInfo.title,
                    content:inputInfo.content,
                    update_time:curTime,
                },
                {
                    where:{
                        id: inputInfo.noteId,
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
                    o_id:inputInfo.noteId,
                    type:1
                },
                {
                    transaction:t
                }
            );

            t.commit();
            console.log("update note success,commit database success")
            output.success = statusCode.SERVICE_STATUS.UPDATE_NOTE_SUCCESS.success
            output.status = statusCode.SERVICE_STATUS.UPDATE_NOTE_SUCCESS.status
            output.description = statusCode.SERVICE_STATUS.UPDATE_NOTE_SUCCESS.description;
            output.data.update_time = curTime;
            res.send(output);
        }

        
    } catch (error) {
        console.log("update note error:",error);
        t.rollback();
        output.success = statusCode.SERVICE_STATUS.UPDATE_NOTE_FAIL.success
        output.status = statusCode.SERVICE_STATUS.UPDATE_NOTE_FAIL.status
        output.description = statusCode.SERVICE_STATUS.UPDATE_NOTE_FAIL.description
        res.send(output);
    }
    console.log("End of Update note");
    return
})
module.exports=router;