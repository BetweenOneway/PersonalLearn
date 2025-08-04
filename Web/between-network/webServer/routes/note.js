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
 * 获取最近访问笔记列表
 * userToken 用户编号
 */
router.get("/getRecentNoteList",async (req,res)=>{
    var output={
        success:true,
        status:'',
        description:'',
        data:[]
    }

    console.log("start getRecentNoteList")
    
    let exceptStatus = 0
    let userInfo = req.userInfo

    try {
        console.log("parsed userinfo=>",userInfo)

        //查询当前日期前30天的笔记
        //let endTime = (new Date()).getTime() - 30*24*60*60*1000;
        //let endDate = new Date(endTime);

        const notes = await sqldb.Note.findAll(
            {
                attributes: ['id', 'title','content','top','update_time'],
                where:{
                    status: {
                        [Op.ne]:exceptStatus,
                    },
                    u_id:userInfo.id,
                    // update_time:{
                    //     [Op.gt]:endDate
                    // }
                },
                order:[
                    ['top', 'DESC'],
                    ['update_time','DESC']
                ],
                limit:10,
                raw:true,
            }
        );
        output.success = statusCode.SERVICE_STATUS.GET_NOTE_SUCCESS.success
        output.status = statusCode.SERVICE_STATUS.GET_NOTE_SUCCESS.status
        output.description = statusCode.SERVICE_STATUS.GET_NOTE_SUCCESS.description

        output.data = notes
    } catch (error) {
        console.log(error)
        output.success = statusCode.SERVICE_STATUS.GET_NOTE_FAIL.success
        output.status = statusCode.SERVICE_STATUS.GET_NOTE_FAIL.status
        output.description = statusCode.SERVICE_STATUS.GET_NOTE_FAIL.description
    }
    res.send(output);
    console.log("End of getRecentNoteList")
    return;
})

/**
 * 获取公开笔记列表
 * pageIndex 第几页
 * pageSize 每页几条数据
 */
router.get("/getOpenNoteList",async (req,res)=>{
    var output={
        success:true,
        status:'',
        description:'',
        data:[]
    }

    console.log("start getOpenNoteList")
    
    let openStatus = 2
    let pageIndex = parseInt(req.query.pageIndex);
    let pageSize = parseInt(req.query.pageSize);
    let offset = pageIndex * pageSize;

    logger.info(`pageIndex:${pageIndex};pageSize:${pageSize};offset:${offset}`);

    try {
        const notes = await sqldb.Note.findAll(
            {
                attributes: ['id', 'title','content','time'],
                include:[
                    {
                        model:sqldb.User,
                        as:'User',
                        attributes:['nickname'],
                    },
                ],
                where:{
                    status: openStatus,
                },
                order:[
                    ['time','DESC']
                ],
                limit:pageSize,
                offset:offset,
                // raw:true,
            }
        );
        let openNotes = [];
        for(let record of notes)
        {
            let note = {};
            note.id = record.id;
            note.title = record.title;
            note.content = record.content;
            note.createDate = record.time;
            note.author = record.User.nickname;
            openNotes.push(note);
        }
        console.log("OpenNotes=>",openNotes);
        output.success = statusCode.SERVICE_STATUS.GET_OPEN_NOTE_SUCCESS.success
        output.status = statusCode.SERVICE_STATUS.GET_OPEN_NOTE_SUCCESS.status
        output.description = statusCode.SERVICE_STATUS.GET_OPEN_NOTE_SUCCESS.description

        output.data = openNotes;
    } catch (error) {
        console.log(error)
        output.success = statusCode.SERVICE_STATUS.GET_OPEN_NOTE_FAIL.success
        output.status = statusCode.SERVICE_STATUS.GET_OPEN_NOTE_FAIL.status
        output.description = statusCode.SERVICE_STATUS.GET_OPEN_NOTE_FAIL.description
    }
    res.send(output);
    console.log("End of getOpenNoteList")
    return;
})

/**
 * 获取指定笔记本内所有笔记列表
 * userToken 用户编号
 */
router.get("/getUserNoteList",async (req,res)=>{
    var output={
        success:true,
        status:'',
        description:'',
        data:[]
    }

    console.log("start getUserNoteList=>",req.query)

    let exceptStatus = 0
    let userInfo = req.userInfo;
    let notebookId = req.query.notebookId;

    if(!notebookId)
    {
        //参数错误
        console.log("param error notebookId undefined=>",notebookId)
        output.success = statusCode.SERVICE_STATUS.PARAM_ERROR.success
        output.status = statusCode.SERVICE_STATUS.PARAM_ERROR.status
        output.description = statusCode.SERVICE_STATUS.PARAM_ERROR.description
    }
    else
    {
        try {
            console.log("parsed userinfo=>",userInfo)

            //查找所有未被删除的笔记
            const notes = await sqldb.Note.findAll(
                {
                    attributes: ['id', 'title','content','top','update_time'],
                    where:{
                        status: {
                            [Op.ne]:exceptStatus,
                        },
                        u_id:userInfo.id,
                        notebook_id:notebookId
                    },
                    order:[
                        ['top', 'DESC'],
                        ['update_time','DESC']
                    ],
                    raw:true,
                }
            );
            output.success = statusCode.SERVICE_STATUS.GET_NOTE_SUCCESS.success
            output.status = statusCode.SERVICE_STATUS.GET_NOTE_SUCCESS.status
            output.description = statusCode.SERVICE_STATUS.GET_NOTE_SUCCESS.description
            output.data = notes
        } catch (error) {
            console.log(error)
            output.success = statusCode.SERVICE_STATUS.GET_NOTE_FAIL.success
            output.status = statusCode.SERVICE_STATUS.GET_NOTE_FAIL.status
            output.description = statusCode.SERVICE_STATUS.GET_NOTE_FAIL.description
        }
    }
    res.send(output);
    console.log("End of getUserNoteList")
    return;
})

/**
 * 置顶 取消置顶
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

    if(!noteId || targetTop === undefined || (0!= targetTop && 1!= targetTop))
    {
        console.log("note set top, noteId or targetTop empty")
        output.success = statusCode.REDIS_STATUS.PARAM_ERROR.success
        output.status = statusCode.REDIS_STATUS.PARAM_ERROR.status
        output.description = statusCode.REDIS_STATUS.PARAM_ERROR.description
        res.send(output)
        return
    }

    let userInfo = req.userInfo;

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
            
            const newAddedLog = await sqldb.operLog.create(
                {
                    time: curTime,
                    event: event.code,
                    desc:event.desc,
                    u_id:userInfo.id,
                    o_id:noteId,
                    type:1
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

/**
 * 笔记公开/私有
 */
router.get("/setNoteOpenStatus",async (req,res)=>{
    let output={
        success:true,
        status:'',
        description:'',
        data:[]
    }
    console.log("start set Note Open Status:",req.query);
    
    //目标状态
    let targetOpenStatus = req.query.targetOpenStatus
    let noteId = req.query.noteId

    if(!noteId || targetOpenStatus === undefined || (1!= targetOpenStatus && 2!= targetOpenStatus))
    {
        console.log("note set open status, noteId or targetOpenStatus empty")
        output.success = statusCode.REDIS_STATUS.PARAM_ERROR.success
        output.status = statusCode.REDIS_STATUS.PARAM_ERROR.status
        output.description = statusCode.REDIS_STATUS.PARAM_ERROR.description
        res.send(output)
        return
    }

    let userInfo = req.userInfo;

    const t = await sqldb.sequelize.transaction();

    try{
        let curTime = new Date().toLocaleString()
        const updateNum = await sqldb.Note.update(
            {
                status:targetOpenStatus,
                update_time:curTime
            },
            {
                where:{
                    id:noteId,
                    u_id:userInfo.id,
                    [Op.and]:[
                        {
                            status:{
                                [Op.ne]: targetOpenStatus
                            }
                        },
                        {
                            status:{
                                [Op.ne]: 0
                            }
                        }
                    ]
                },
                transaction: t
            }
        );
        if(updateNum > 0)
        {
            let event = targetOpenStatus === 2? statusCode.EVENT_LIST.NOTE_SET_OPEN : statusCode.EVENT_LIST.NOTE_UNSET_OPEN;
            
            const newAddedLog = await sqldb.operLog.create(
                {
                    time: curTime,
                    event: event.code,
                    desc:event.desc,
                    u_id:userInfo.id,
                    o_id:noteId,
                    type:1
                }, 
                { 
                    transaction: t 
                }
            )
            t.commit();
            output.success = statusCode.SERVICE_STATUS.NOTE_SET_OPEN_SUCCESS.success
            output.status = statusCode.SERVICE_STATUS.NOTE_SET_OPEN_SUCCESS.status
            output.description = statusCode.SERVICE_STATUS.NOTE_SET_OPEN_SUCCESS.description
            res.send(output);
        }
        else{
            console.log("set note top,updateNum=",updateNum);
            t.rollback()
            output.success = statusCode.SERVICE_STATUS.NOTE_SET_OPEN_FAIL.success
            output.status = statusCode.SERVICE_STATUS.NOTE_SET_OPEN_FAIL.status
            output.description = statusCode.SERVICE_STATUS.NOTE_SET_OPEN_FAIL.description
            res.send(output);
        }
    }
    catch(e){
        console.log(e)
        t.rollback()
        output.success = statusCode.SERVICE_STATUS.NOTE_SET_OPEN_FAIL.success
        output.status = statusCode.SERVICE_STATUS.NOTE_SET_OPEN_FAIL.status
        output.description = statusCode.SERVICE_STATUS.NOTE_SET_OPEN_FAIL.description
        res.send(output);
    }
    console.log("End of set note open or private");
    return
})

/**
 * 笔记重命名
 */
router.post("/renameNote",async (req,res)=>{
    let output={
        success:true,
        status:'',
        description:'',
        data:[]
    }
    console.log("start rename note:",req.body);
    
    //目标状态
    let newName = req.body.title
    let noteId = req.body.id

    if(!noteId || newName === undefined || 0 == newName.length)
    {
        console.log("note rename, noteId or newName empty")
        output.success = statusCode.REDIS_STATUS.PARAM_ERROR.success
        output.status = statusCode.REDIS_STATUS.PARAM_ERROR.status
        output.description = statusCode.REDIS_STATUS.PARAM_ERROR.description
        res.send(output)
        return
    }

    let userInfo = req.userInfo;

    const t = await sqldb.sequelize.transaction();

    try{
        const matchedNoteCount = await sqldb.Note.count(
            {
                where:{
                    title:newName,
                    id:noteId,
                    u_id:userInfo.id,
                    status:1
                }
            }
        );

        let updateNum = 0;
        if(0 == matchedNoteCount)
        {
            let curTime = new Date().toLocaleString()
            updateNum = await sqldb.Note.update(
                {
                    title:newName,
                    update_time:curTime
                },
                {
                    where:{
                        id:noteId,
                        u_id:userInfo.id,
                        status:1
                    },
                    transaction: t
                }
            );
            if(updateNum > 0)
            {
                //记录日志
                let event = statusCode.EVENT_LIST.RENAME_NOTEBOOK;
                
                const newAddedLog = await sqldb.operLog.create(
                    {
                        time: curTime,
                        event: event.code,
                        desc:event.desc,
                        u_id:userInfo.id,
                        o_id:noteId,
                        type:1
                    }, 
                    { 
                        transaction: t 
                    }
                )
                t.commit();
            }
            else
            {
                throw "rename fail";
            }
        }

        output.success = statusCode.SERVICE_STATUS.RENAME_NOTE_SUCCESS.success
        output.status = statusCode.SERVICE_STATUS.RENAME_NOTE_SUCCESS.status
        output.description = statusCode.SERVICE_STATUS.RENAME_NOTE_SUCCESS.description
        res.send(output);
        
    }
    catch(e){
        console.log(e)
        t.rollback()
        output.success = statusCode.SERVICE_STATUS.RENAME_NOTE_FAIL.success
        output.status = statusCode.SERVICE_STATUS.RENAME_NOTE_FAIL.status
        output.description = statusCode.SERVICE_STATUS.RENAME_NOTE_FAIL.description
        res.send(output);
    }
    console.log("End of rename");
    return
})

/**
 * 新增笔记
 * userToken 用户信息
 */
router.put("/createNote",async (req,res)=>{
    console.log("create note request info:",req);

    let output={
        success:false,
        status:"",
        description:"",
        data:{}
    }

    const t = await sqldb.sequelize.transaction();

    let notebookId = req.query.notebookId;

    if(!notebookId)
    {
        //参数错误
        console.log("create note param error notebookId undefined=>",notebookId)
        output.success = statusCode.SERVICE_STATUS.PARAM_ERROR.success
        output.status = statusCode.SERVICE_STATUS.PARAM_ERROR.status
        output.description = statusCode.SERVICE_STATUS.PARAM_ERROR.description
    }

    try {
        let userInfo = req.userInfo;
        let curTime = new Date().toLocaleString()

        const newAddNote = await sqldb.Note.create(
            {
                title:'新笔记',
                u_id:userInfo.id,
                notebook_id:notebookId,
                time:curTime,
                update_time:curTime,
                status:1,
                type:1
            },
            {
                transaction:t
            }
        );
        console.log("new added note info:",newAddNote);
        let event = statusCode.EVENT_LIST.ADD_NOTE;
        const addLog = await sqldb.operLog.create(
            {
                time:curTime,
                event:event.code,
                desc:event.desc,
                u_id:userInfo.id,
                o_id:newAddNote.id,
                type:1
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

/**
 * 获取笔记信息
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

    let userInfo = req.userInfo;

    let noteId = req.query.noteId;

    try {
        console.log("get note info from db");
        const noteInfo = await sqldb.Note.findOne(
            {
                attributes: ['update_time', 'content','title','u_id','status'],
                where: {
                    id: noteId,
                    u_id:userInfo.id
                }
            }
        );
        //console.log("retrived info from db:",noteInfo);
        if(noteInfo == null)
        {
            console.log("笔记获取失败，请稍后再试");
            output.success = statusCode.SERVICE_STATUS.GET_NOTE_FAIL.success
            output.status = statusCode.SERVICE_STATUS.GET_NOTE_FAIL.status
            output.description = statusCode.SERVICE_STATUS.GET_NOTE_FAIL.description
        }
        else{
            console.log("笔记获取信息成功");
            output.success = statusCode.SERVICE_STATUS.GET_NOTE_SUCCESS.success
            output.status = statusCode.SERVICE_STATUS.GET_NOTE_SUCCESS.status
            output.description = statusCode.SERVICE_STATUS.GET_NOTE_SUCCESS.description
            output.data = noteInfo;
            if(!noteInfo.title)
            {
                output.data.title = "";
            }

            if(!noteInfo.content)
            {
                output.data.content = "";
            }
        }
        res.send(output);
    } catch (error) {
        console.log("Get note info error:",error);
        output.success = statusCode.SERVICE_STATUS.COMMON_EXCEPTION.success
        output.status = statusCode.SERVICE_STATUS.COMMON_EXCEPTION.status
        output.description = statusCode.SERVICE_STATUS.COMMON_EXCEPTION.description
        res.send(output);
    }
    console.log("End Get Note Info");
    return
})

/**
 * 保存（更新）笔记
 * userToken 用户编号
 * noteId 笔记编号
 * title 标题
 * body 笔记内容
 * content 笔记内容（完整 包含title和body）
 */
router.post("/saveNote",async (req,res)=>{
    console.log("start update Note :",req.body);

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