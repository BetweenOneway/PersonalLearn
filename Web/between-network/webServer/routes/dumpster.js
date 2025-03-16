const express=require("express");
const { Op } = require("sequelize");

let statusCode = require("./statusCode")

var router=express.Router();

/**
 * 
 * @param {*} userInfo 
 * @param {*} notebooks 
 * @param {*} t 
 * @returns 
 */
async function RestoreNotebooks(userInfo,notebooks,t)
{
    logger.info(`start restore notebooks=>${notebooks.length}`);
    if(0 == notebooks.length)
    {
        return true;
    }
    //0-被删除
    const targetStatus = 0;

    let curTime = new Date().toLocaleString()

    try {
        for(let notebook of notebooks)
        {
            //记录该笔记本ID以及其子笔记本ID
            let notebookIds = [];
            notebookIds.push(notebook.id);
    
            
            let targetParentIds = [];
            targetParentIds.push(notebook.id);
            //查询出指定文件夹的所有子文件夹，要求状态已删除
            do {
                let childNotebookIds = [];
                childNotebookIds = await sqldb.Notebook.findAll(
                    {
                        attributes: ['id'],
                        where:{
                            parent_id:{
                                [Op.in]:targetParentIds
                            },
                            u_id:userInfo.id,
                            status:{
                                [Op.eq]:targetStatus,
                            }
                        },
                        raw:true,
                    }
                );
                logger.info(`childNotebookIds=>${childNotebookIds}`);
                logger.info(`childNotebookIds.length=>${childNotebookIds.length}`);
                if(0 != childNotebookIds.length)
                {
                    //再以子文件夹为目标，查询更下一级的笔记本
                    targetParentIds = [];
                    for(let elm of childNotebookIds)
                    {
                        targetParentIds.push(elm.id);
                        notebookIds.push(elm.id);
                    }
                }
            } while (0 != childNotebookIds.length);
    
            logger.info(`to restore notebookIds=>${notebookIds}`);

            {
                //更新笔记本状态为正常
                const updateNum = await sqldb.Notebook.update(
                    {
                        status:1,
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
                logger.info(`Notebook update Num=>${updateNum}`);

                //回收站表中移除相应记录
                const dumpsterDestroyResult = await sqldb.Dumpster.destroy(
                    {
                        where:{
                            object_id: {
                                [Op.eq]:notebook.id,
                            },
                            type:2,//笔记本
                            u_id:userInfo.id
                        },
                        transaction:t
                    }
                );
                logger.info(`remove notebook form dumpster Result=>${dumpsterDestroyResult}`);
            }

            //记录日志
            let event = statusCode.EVENT_LIST.RESTORE_NOTEBOOK;

            const addLog = await sqldb.operLog.create(
                {
                    time:curTime,
                    event:event.code,
                    desc:event.desc,
                    u_id:userInfo.id,
                    o_id:notebook.id,
                    type:1
                },
                {
                    transaction:t
                }
            );
        }
        return true;
    } catch (error) {
        logger.error(`restore notebook error=>${error}`);
        return false;
    }
    return true;
}

async function RestoreNotes(userInfo,notes,t)
{
    logger.info(`start restore notes=>${notes.length}`);

    if(0 == notes.length)
    {
        return true;
    }

    let curTime = new Date().toLocaleString()
    const targetStatus = 1;//正常状态
    let event = statusCode.EVENT_LIST.RESTORE_NOTE;

    try {
        let toDeleteNotesId = [];
        let dumpsterList = [];
        let logList = [];
        for(let note of notes)
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

        //更新笔记状态
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
        logger.info(`noteUpdateResult=>${noteUpdateResult}`);
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

        //记录日志
        const addLogResult = await sqldb.operLog.bulkCreate(
            logList,
            {
                transaction:t
            }
        );
        logger.info(`addLogResult=>${addLogResult}`);
    } catch (error) {
        logger.error(`Restore notes error=>${error}`);
        return false;
    }

    return true;
}

/**
 * 获取用户回收站中的文件
 * userToken 用户编号
 */
router.get("/getFileList",async (req,res)=>{
    console.log("start get dumpster file lists :",req.query);

    let output={
        success:false,
        status:"",
        description:"",
        data:[]
    }

    try {
        console.log("userInfo:",req.userInfo);
        let userInfo = req.userInfo;

        const fileLists = await sqldb.Dumpster.findAll(
            {
                attributes: ['id','name','type','time'],
                where:{
                    u_id:userInfo.id
                },
                order:[
                    ['time','DESC']
                ],
                raw:true,
            }
        );
        output.data = fileLists;
        output.success = statusCode.SERVICE_STATUS.GET_DUMPSTER_FILE_LIST_SUCCESS.success
        output.status = statusCode.SERVICE_STATUS.GET_DUMPSTER_FILE_LIST_SUCCESS.status
        output.description = statusCode.SERVICE_STATUS.GET_DUMPSTER_FILE_LIST_SUCCESS.description
        res.send(output);

    } catch (error) {
        console.log("get dumpster file lists error:",error);
        output.success = statusCode.SERVICE_STATUS.GET_DUMPSTER_FILE_LIST_FAIL.success
        output.status = statusCode.SERVICE_STATUS.GET_DUMPSTER_FILE_LIST_FAIL.status
        output.description = statusCode.SERVICE_STATUS.GET_DUMPSTER_FILE_LIST_FAIL.description
        res.send(output);
    }
    console.log("End of get dumpster file lists");
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
    console.log("start restore files,req.query:",req.query);

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
                throw new Error("restore notebook error");
            }
        }
        if(0 != toDeleteNotes.length)
        {
            if(!await deleteNotes(userInfo,isCompleteDel,toDeleteNotes,t))
            {
                throw new Error("restore notes error");
            }
        }

        output.success = statusCode.SERVICE_STATUS.RESTORE_FILE_SUCCESS.success
        output.status = statusCode.SERVICE_STATUS.RESTORE_FILE_SUCCESS.status
        output.description = statusCode.SERVICE_STATUS.RESTORE_FILE_SUCCESS.description

        t.commit();
    } catch (error) {
        //出错处理
        logger.error(`restore files error=>${error}`);

        t.rollback();

        output.success = statusCode.SERVICE_STATUS.RESTORE_FILE_FAIL.success
        output.status = statusCode.SERVICE_STATUS.RESTORE_FILE_FAIL.status
        output.description = statusCode.SERVICE_STATUS.RESTORE_FILE_FAIL.description

    }

    logger.info("End of restore files")

    res.send(output);
    return
})

module.exports=router;