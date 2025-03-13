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
                console.log("notebookIds=>",notebookIds);
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
    //[{id,title,type},{}...]
    let toDeleteFiles = req.query.files;
    //目标状态
    let userInfo = req.userInfo;

    const t = await sqldb.sequelize.transaction();

    try {
        //将要删除的数据按类型分类
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



module.exports=router;