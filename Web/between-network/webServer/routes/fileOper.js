const express=require("express");
const { Op } = require("sequelize");

//数据库
var sqldb = require('../sqldb');

let statusCode = require("./statusCode")

var router=express.Router();

async function deleteFile(userInfo,isCompleteDel,toDeleteFiles,res)
{

}

/**
 * 删除笔记本
 * isCompleteDel 是否彻底删除 否：置删除状态 是：数据库移除
 * notebookId 待删除笔记本ID
 */
async function deleteFolder(userInfo,isCompleteDel,toDeleteNotebooks,res)
{
    if(0 == toDeleteNotebooks.length)
    {
        return;
    }
    const targetStatus = 1;
    const t = await sqldb.sequelize.transaction();

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
                if(0 != childNotebookIds)
                {
                    targetParentIds = childNotebookIds;
                    notebookIds.concat(childNotebookIds);
                }
            } while (0 != childNotebookIds.length);
    
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
            console.log('updateNum=>',updateNum);
    
            //关联笔记本记录中移除主笔记本编号
            notebookIds.slice(1);
            let related = JSON.stringify(notebookIds);
            //回收站表新增相应记录
            const dumpsterAddResult = await sqldb.dumpster.create(
                {
                    u_id:userInfo.id,
                    object_id:toDeleteNotebook.id,
                    name:toDeleteNotebook.title,
                    type:1,
                    related:related,
                    time:curTime
                },
                {
                    transaction:t
                }
            );
            console.log("dumpster Add Result=>",dumpsterAddResult);
    
            //记录日志
            let event = statusCode.EVENT_LIST.RENAME_NOTEBOOK;
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
        t.commit();
    } catch (error) {
        console.log("delete notebook error=>",error);
        t.rollback();
    }
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
        
        let curTime = new Date().toLocaleString()

        let noteIdList = [];
        let memoIdList = [];

        for(let fileInfo of toDeleteFiles)
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
            output.success = statusCode.SERVICE_STATUS.DEL_NOTE_FAIL.success
            output.status = statusCode.SERVICE_STATUS.DEL_NOTE_FAIL.status
            output.description = statusCode.SERVICE_STATUS.DEL_NOTE_FAIL.description
            res.send(output);
            return;
        }
        let noteEffectedNum = 0;
        let memoEffectedNum = 0;

        //笔记
        if(noteIdList.length != 0)
        {
            if(isCompleteDel)
            {
                //彻底删除 则移除数据
                noteEffectedNum = await sqldb.Note.destroy(
                    {
                        where:{
                            type:1,
                            id:noteIdList,
                        },
                        transaction:t
                    }
                );
                console.log("noteEffectedNum:",noteEffectedNum);
            }
            else
            {
                let targetStatus = 0;
                noteEffectedNum = await sqldb.Note.update(
                    {
                        status:targetStatus,
                        update_time:curTime
                    },
                    {
                        where:{
                            id:noteIdList,
                            u_id:userInfo.id,
                            status:{
                                [Op.ne]:targetStatus
                            }
                        },
                        transaction:t
                    }
                );
            }
            
        }
        //删除便签
        if(memoIdList.length != 0)
        {
            //便签
            if(isCompleteDel)
            {
                //彻底删除 则移除数据
                memoEffectedNum = await sqldb.Memo.destroy(
                    {
                        where:{
                            type:1,
                            id:memoIdList,
                        },
                        transaction:t
                    }
                );
                console.log("noteEffectedNum:",noteEffectedNum);
            }
            else
            {
                let targetStatus = 0;
                memoEffectedNum = await sqldb.Memo.update(
                    {
                        status:targetStatus,
                        update_time:curTime
                    },
                    {
                        where:{
                            id:memoIdList,
                            u_id:userInfo.id,
                            status:{
                                [Op.ne]:targetStatus
                            }
                        },
                        transaction:t
                    }
                );
            }
            
        }

        //操作文件数量与传入数量不一致 回滚
        if((memoIdList.length != 0 && memoEffectedNum != memoIdList.length) 
            || (noteIdList.length != 0 && noteEffectedNum != noteIdList.length))
        {
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
            
            res.send(output);
            return;
        }

        //记录日志
        {
            let operNum = 0;
            let event = null;
            let logList = [];

            //笔记相关日志
            if(noteIdList.length > 0)
            {
                event = isCompleteDel? statusCode.EVENT_LIST.NOTE_COMPEL_DEL : statusCode.EVENT_LIST.NOTE_DEL;
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
                event = isCompleteDel? statusCode.EVENT_LIST.MEMO_COMPEL_DEL : statusCode.EVENT_LIST.MEMO_DEL;
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
        res.send(output);
        return;
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
        res.send(output);
    }

    console.log("End of delete files")
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