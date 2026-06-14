const express=require("express");
const { Op } = require("sequelize");

//数据库
var sqldb = require('../sqldb');

let statusCode = require("./statusCode")

var router=express.Router();

/**
 * 删除/彻底删除笔记
 * @param {*} userInfo 
 * @param {*} isCompleteDel 
 * @param {*} toDeleteFiles 
 * @param {*} t 
 * @returns 
 */
async function deleteNotes(userInfo,isCompleteDel,toDeleteFiles,t)
{
    logger.info(`start delete notes=>${toDeleteFiles.length}`);

    if(0 == toDeleteFiles.length)
    {
        return true;
    }

    let curTime = new Date().toLocaleString()

    const deleteStatus = 0;
    const normalStatus = 1;
    const completeDeleteStatus = -1;
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
            //笔记表中移除相应记录
            const noteDestroyResult = await sqldb.Note.destroy(
                {
                    where:{
                        id: {
                            [Op.in]:toDeleteNotesId,
                        },
                        u_id:userInfo.id,
                        status:{
                            [Op.eq]:deleteStatus
                        }
                    },
                    transaction:t
                }
            );
            logger.info(`noteDestroyResult=>${noteDestroyResult}`);
            //回收站表中移除相应记录
            const dumpsterDestroyResult = await sqldb.Dumpster.destroy(
                {
                    where:{
                        object_id: {
                            [Op.in]:toDeleteNotesId,
                        },
                        type:1,
                        u_id:userInfo.id
                    },
                    transaction:t
                }
            );
            logger.info(`noteDestroyResult=>${dumpsterDestroyResult}`);
        }
        else{
            //更新笔记状态
            const noteUpdateResult = await sqldb.Note.update(
                {
                    status:deleteStatus,
                    update_time:curTime,
                },
                {
                    where:{
                        id: {
                            [Op.in]:toDeleteNotesId,
                        },
                        u_id:userInfo.id,
                        status:{
                            [Op.eq]:normalStatus
                        }
                    },
                    transaction:t
                }
            );
            logger.info(`noteUpdateResult=>${noteUpdateResult}`);

            //回收站表新增相应记录
            const dumpsterAddResult = await sqldb.Dumpster.bulkCreate(
                dumpsterList,
                {
                    transaction:t
                }
            );
            logger.info(`dumpsterAddResult=>${dumpsterAddResult}`);
        }

        //记录日志
        const addLogResult = await sqldb.operLog.bulkCreate(
            logList,
            {
                transaction:t
            }
        );
        logger.info(`addLogResult=>${addLogResult}`);
        
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
    logger.info(`start delete folder=>${toDeleteNotebooks.length}`);
    if(0 == toDeleteNotebooks.length)
    {
        return true;
    }
    //0-被删除
    const targetStatus = 0;

    const deleteStatus = 0;
    const normalStatus = 1;
    const completeDeleteStatus = -1;

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
                                [Op.notIn]:[deleteStatus,completeDeleteStatus],
                            }
                        },
                        raw:true,
                    }
                );
                logger.info(`childNotebookIds=>${childNotebookIds}`);
                logger.info(`childNotebookIds.length=>${childNotebookIds.length}`);
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
    
            logger.info(`to update notebookIds=>${notebookIds}`);

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
                                [Op.eq]:deleteStatus
                            }
                        },
                        transaction:t
                    }
                );
                logger.info(`complete delte notebook num=>${updateNum}`);

                //回收站表中移除相应记录
                const dumpsterDestroyResult = await sqldb.Dumpster.destroy(
                    {
                        where:{
                            object_id: {
                                [Op.in]:notebookIds,
                            },
                            type:2,
                            u_id:userInfo.id
                        },
                        transaction:t
                    }
                );
                logger.info(`note book Destroy Result=>${dumpsterDestroyResult}`);
            }
            else
            {
                //更新笔记本状态
                const updateNum = await sqldb.Notebook.update(
                    {
                        status:deleteStatus,
                        update_time:curTime,
                    },
                    {
                        where:{
                            id: {
                                [Op.in]:notebookIds,
                            },
                            u_id:userInfo.id,
                            status:{
                                [Op.eq]:normalStatus
                            }
                        },
                        transaction:t
                    }
                );
                logger.info(`Notebook updateNum=>${updateNum}`);

                //回收站表只记录主笔记本的相应记录，相应的子笔记本不做记录
                const dumpsterAddResult = await sqldb.Dumpster.create(
                    {
                        u_id:userInfo.id,
                        object_id:toDeleteNotebook.id,
                        name:toDeleteNotebook.title,
                        type:2,
                        time:curTime
                    },
                    {
                        transaction:t
                    }
                );
                logger.info(`dumpster Add Result=>${dumpsterAddResult}`);
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
        logger.error(`delete notebook error=>${error}`);
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