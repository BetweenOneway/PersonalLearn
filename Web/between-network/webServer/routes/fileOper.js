const express=require("express");
const { Op } = require("sequelize");

//数据库
var sqldb = require('../sqldb');

let statusCode = require("./statusCode")

var router=express.Router();

/**
 * 
 * @param {*} userInfo 
 * @param {*} isCompleteDel 
 * @param {*} toDeleteFiles 
 * @param {*} t 
 * @returns 
 */
async function deleteNotes(userInfo,isCompleteDel,toDeleteFiles,t)
{
    console.log("start delete notes=>",toDeleteFiles.length);

    if(0 == toDeleteFiles.length)
    {
        return true;
    }

    let curTime = new Date().toLocaleString()
    const targetStatus = 1;
    let event = {};
    if(isCompleteDel)
    {
        event = statusCode.EVENT_LIST.NOTE_COMPEL_DEL;
    }
    else{
        event = statusCode.EVENT_LIST.NOTE_DEL;
    }

    try {
        let toDeleteNotesId = [];
        let dumpsterList = [];
        let logList = [];
        for(let note of toDeleteFiles)
        {
            toDeleteNotesId.push(note.id);
            dumpsterList.push(
                {
                    u_id:userInfo.id,
                    object_id:note.id,
                    name:note.title,
                    type:1,
                    time:curTime
                }
            );
            logList.push(
                {
                    time:curTime,
                    event:event.code,
                    desc:event.desc,
                    u_id:userInfo.id,
                    o_id:note.id,
                    type:1
                }
            );
        }
        if(isCompleteDel)
        {
            //更新笔记本状态
            const noteDestroyResult = await sqldb.Note.destroy(
                {
                    where:{
                        id: {
                            [Op.in]:toDeleteNotesId,
                        },
                        u_id:userInfo.id,
                        status:{
                            [Op.ne]:targetStatus
                        }
                    },
                    transaction:t
                }
            );
            console.log("noteDestroyResult=>",noteDestroyResult);
        }
        else{
            //更新笔记本状态
            const noteUpdateResult = await sqldb.Note.update(
                {
                    status:targetStatus,
                    update_time:curTime,
                },
                {
                    where:{
                        id: {
                            [Op.in]:toDeleteNotesId,
                        },
                        u_id:userInfo.id,
                        status:{
                            [Op.ne]:targetStatus
                        }
                    },
                    transaction:t
                }
            );
            console.log("noteUpdateResult=>",noteUpdateResult);

            //回收站表新增相应记录
            const dumpsterAddResult = await sqldb.Dumpster.bulkCreate(
                dumpsterList,
                {
                    transaction:t
                }
            );
            console.log("dumpsterAddResult=>",dumpsterAddResult);
        }

        //记录日志
        const addLogResult = await sqldb.operLog.bulkCreate(
            logList,
            {
                transaction:t
            }
        );
        console.log("addLogResult=>",addLogResult);
        
        return true;
    } catch (error) {
        return false;
    }
}

/**
 * 删除笔记本
 * isCompleteDel 是否彻底删除 否：置删除状态 是：数据库移除
 * notebookId 待删除笔记本ID
 */
async function deleteFolder(userInfo,isCompleteDel,toDeleteNotebooks,t)
{
    console.log("start delete folder=>",toDeleteNotebooks.length);
    if(0 == toDeleteNotebooks.length)
    {
        return true;
    }
    //0-被删除
    const targetStatus = 0;

    let curTime = new Date().toLocaleString()

    try {
        for(let toDeleteNotebook of toDeleteNotebooks)
        {
            let notebookIds = [];
            notebookIds.push(toDeleteNotebook.id);
    
            let childNotebookIds = [];
            let targetParentIds = [];
            targetParentIds.push(toDeleteNotebook.id);
            //查询出指定文件夹的所有子文件夹
            do {
                childNotebookIds = [];
                childNotebookIds = await sqldb.Notebook.findAll(
                    {
                        attributes: ['id'],
                        where:{
                            parent_id:{
                                [Op.in]:targetParentIds
                            },
                            u_id:userInfo.id,
                            status:{
                                [Op.ne]:targetStatus,
                            }
                        },
                        raw:true,
                    }
                );
                console.log("childNotebookIds=>",childNotebookIds);
                console.log("childNotebookIds.length=>",childNotebookIds.length);
                if(0 != childNotebookIds.length)
                {
                    targetParentIds = [];
                    for(let elm of childNotebookIds)
                    {
                        targetParentIds.push(elm.id);
                        notebookIds.push(elm.id);
                    }
                }
            } while (0 != childNotebookIds.length);
    
            console.log("to update notebookIds=>",notebookIds);

            if(isCompleteDel)
            {
                //完全删除前需要处于已删除状态
                const updateNum = await sqldb.Notebook.destroy(
                    {
                        where:{
                            id: {
                                [Op.in]:notebookIds,
                            },
                            u_id:userInfo.id,
                            status:{
                                [Op.eq]:targetStatus
                            }
                        },
                        transaction:t
                    }
                );
                console.log('updateNum=>',updateNum);
            }
            else
            {
                //更新笔记本状态
                const updateNum = await sqldb.Notebook.update(
                    {
                        status:targetStatus,
                        update_time:curTime,
                    },
                    {
                        where:{
                            id: {
                                [Op.in]:notebookIds,
                            },
                            u_id:userInfo.id,
                            status:{
                                [Op.ne]:targetStatus
                            }
                        },
                        transaction:t
                    }
                );
                console.log('Notebook updateNum=>',updateNum);

                //关联笔记本记录中移除主笔记本编号
                notebookIds.slice(1);
                let related = JSON.stringify(notebookIds);
                //回收站表新增相应记录
                const dumpsterAddResult = await sqldb.Dumpster.create(
                    {
                        u_id:userInfo.id,
                        object_id:toDeleteNotebook.id,
                        name:toDeleteNotebook.title,
                        type:2,
                        related:related,
                        time:curTime
                    },
                    {
                        transaction:t
                    }
                );
                console.log("dumpster Add Result=>",dumpsterAddResult);
            }

            //记录日志
            let event = {};
            if(isCompleteDel)
            {
                event = statusCode.EVENT_LIST.COMPEL_DELETE_NOTEBOOK;
            }
            else{
                event = statusCode.EVENT_LIST.DELETE_NOTEBOOK;
            }
            const addLog = await sqldb.operLog.create(
                {
                    time:curTime,
                    event:event.code,
                    desc:event.desc,
                    u_id:userInfo.id,
                    o_id:toDeleteNotebook.id,
                    type:1
                },
                {
                    transaction:t
                }
            );
        }
        return true;
    } catch (error) {
        console.log("delete notebook error=>",error);
        return false;
    }
    return true;
}

/**
 * 删除文件
 */
router.delete("/deleteFiles",async (req,res)=>{
    let output={
        success:true,
        status:'',
        description:'',
        data:[]
    }
    console.log("start del files,req.query:",req.query);

    let isCompleteDel = req.query.complete =='true'?true:false;
    //[{id,title,type,key,theme,icon,tip},{}...]
    let toDeleteFiles = req.query.files;
    //目标状态
    let userInfo = req.userInfo;

    const t = await sqldb.sequelize.transaction();

    try {
        let toDeleteNotebooks = [];
        let toDeleteNotes = [];
        for(let file of toDeleteFiles)
        {
            if(1 == file.type)
            {
                toDeleteNotes.push(file)
            }
            else if(2 == file.type)
            {
                toDeleteNotebooks.push(file);
            }
        }
        if(0 != toDeleteNotebooks.length)
        {
            if(!await deleteFolder(userInfo,isCompleteDel,toDeleteNotebooks,t))
            {
                throw new Error("Delete folder error");
            }
        }
        if(0 != toDeleteNotes.length)
        {
            if(!await deleteNotes(userInfo,isCompleteDel,toDeleteNotes,t))
            {
                throw new Error("Delete file error");
            }
        }
        if(isCompleteDel)
        {
            output.success = statusCode.SERVICE_STATUS.COMPLETE_DEL_FILE_SUCCESS.success
            output.status = statusCode.SERVICE_STATUS.COMPLETE_DEL_FILE_SUCCESS.status
            output.description = statusCode.SERVICE_STATUS.COMPLETE_DEL_FILE_SUCCESS.description
        }
        else
        {
            output.success = statusCode.SERVICE_STATUS.DEL_FILE_SUCCESS.success
            output.status = statusCode.SERVICE_STATUS.DEL_FILE_SUCCESS.status
            output.description = statusCode.SERVICE_STATUS.DEL_FILE_SUCCESS.description
        }
        
        t.commit();
    } catch (error) {
        //出错处理
        console.log(error)

        t.rollback();
        if(isCompleteDel)
        {
            output.success = statusCode.SERVICE_STATUS.COMPLETE_DEL_FILE_FAIL.success
            output.status = statusCode.SERVICE_STATUS.COMPLETE_DEL_FILE_FAIL.status
            output.description = statusCode.SERVICE_STATUS.COMPLETE_DEL_FILE_FAIL.description
        }
        else
        {
            output.success = statusCode.SERVICE_STATUS.DEL_FILE_FAIL.success
            output.status = statusCode.SERVICE_STATUS.DEL_FILE_FAIL.status
            output.description = statusCode.SERVICE_STATUS.DEL_FILE_FAIL.description
        }
    }

    console.log("End of delete files")

    res.send(output);
    return
})

/**
 * 恢复已删除文件
 */
router.post("/restoreFiles",async (req,res)=>{
    let output={
        success:true,
        status:'',
        description:'',
        data:[]
    }
    console.log("start restore files,req.body:",req.body);

    //[{id,title,type,key,theme,icon,tip},{}...]
    let toRestoreFiles = req.body.files;
    //目标状态
    let userInfo = req.userInfo;

    const t = await sqldb.sequelize.transaction();

    try {
        
        let curTime = new Date().toLocaleString()

        let noteIdList = [];
        let memoIdList = [];

        for(let fileInfo of toRestoreFiles)
        {
            if(fileInfo.type == '1')
            {
                noteIdList.push(fileInfo.id);
            }
            else if(fileInfo.type == '2')
            {
                memoIdList.push(fileInfo.id);
            }
        }

        console.log("noteIdList=",noteIdList);
        console.log("memoIdList=",memoIdList);
        //数据为空
        if(noteIdList.length == 0 && memoIdList.length == 0)
        {
            output.success = statusCode.SERVICE_STATUS.PARAM_ERROR.success
            output.status = statusCode.SERVICE_STATUS.PARAM_ERROR.status
            output.description = statusCode.SERVICE_STATUS.PARAM_ERROR.description
            res.send(output);
            return;
        }
        let noteEffectedNum = 0;
        let memoEffectedNum = 0;

        //笔记
        if(noteIdList.length != 0)
        {
            const noteEffectedNum = await sqldb.Note.update(
                {
                    status:1,
                    update_time:curTime
                },
                {
                    where:{
                        id:noteIdList,
                        u_id:userInfo.id,
                        top:{
                            [Op.ne]: targetTop
                        },
                        status:0
                    },
                    transaction: t
                }
            );
            
        }
        //删除便签
        if(memoIdList.length != 0)
        {
            //便签
            const noteEffectedNum = await sqldb.Memo.update(
                {
                    status:1,
                    update_time:curTime
                },
                {
                    where:{
                        id:memoIdList,
                        u_id:userInfo.id,
                        top:{
                            [Op.ne]: targetTop
                        },
                        status:0
                    },
                    transaction: t
                }
            );
        }

        //操作文件数量与传入数量不一致 回滚
        if((memoIdList.length != 0 && memoEffectedNum != memoIdList.length) 
            || (noteIdList.length != 0 && noteEffectedNum != noteIdList.length))
        {
            throw "更新数量与传入数量不一致";
        }

        //记录日志
        {
            let operNum = 0;
            let event = null;
            let logList = [];

            //笔记相关日志
            if(noteIdList.length > 0)
            {
                event = statusCode.EVENT_LIST.RESTORE_NOTE;
                for(let noteId of noteIdList)
                {
                    let log = {
                        time:curTime,
                        event:event.code,
                        desc:event.desc,
                        u_id:userInfo.id,
                        o_id:noteId,
                        type:1
                    }
                    logList.push(log);
                }
                operNum = await sqldb.operLog.bulkCreate(logList,
                    {
                        transaction:t
                    }
                );
    
                console.log("add note log operNum:",operNum);
            }
            

            //便签相关日志
            if(noteIdList.length > 0)
            {
                event = statusCode.EVENT_LIST.RESTORE_MEMO;
                logList = [];
                for(let memoId of memoIdList)
                {
                    let log = {
                        time:curTime,
                        event:event.code,
                        desc:event.desc,
                        u_id:userInfo.id,
                        o_id:memoId,
                        type:2
                    }
                    logList.push(log);
                }
                operNum = await sqldb.operLog.bulkCreate(logList,
                    {
                        transaction:t
                    }
                );
                console.log("add memo log operNum:",operNum);
            }
        }

        t.commit();

        output.success = statusCode.SERVICE_STATUS.RESTORE_FILE_SUCCESS.success
        output.status = statusCode.SERVICE_STATUS.RESTORE_FILE_SUCCESS.status
        output.description = statusCode.SERVICE_STATUS.RESTORE_FILE_SUCCESS.description

        res.send(output);
        return;
    } catch (error) {
        //出错处理
        console.log(error)

        t.rollback();

        output.success = statusCode.SERVICE_STATUS.RESTORE_FILE_FAIL.success
        output.status = statusCode.SERVICE_STATUS.RESTORE_FILE_FAIL.status
        output.description = statusCode.SERVICE_STATUS.RESTORE_FILE_FAIL.description

        res.send(output);
    }

    console.log("End of delete files")
    return
})

module.exports=router;