const express=require("express");
const { Op } = require("sequelize");

//数据库
var sqldb = require('../sqldb');

let statusCode = require("./statusCode")

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

    logger.info("start get user notebook list")

    //0 被删除
    let targetStatus = 0;
    try {
        let userInfo = req.userInfo
        logger.info(`parsed userinfo=>${JSON.stringify(userInfo)}`)

        //查询属于当前用户的，未被删除的笔记本
        const notebooks = await sqldb.Notebook.findAll(
            {
                attributes: ['id', 'name','level','index','parent_id'],
                where:{
                    u_id:userInfo.id,
                    status:{
                        [Op.ne]:targetStatus
                    }
                },
                order:[
                    ['level', 'ASC'],
                    ['index', 'ASC']
                ],
                raw:true,
            }
        );
        output.success = statusCode.SERVICE_STATUS.GET_NOTEBOOK_SUCCESS.success
        output.status = statusCode.SERVICE_STATUS.GET_NOTEBOOK_SUCCESS.status
        output.description = statusCode.SERVICE_STATUS.GET_NOTEBOOK_SUCCESS.description

        output.data = notebooks
        res.send(output);
    } catch (error) {
        logger.error(error)
        output.success = statusCode.SERVICE_STATUS.GET_NOTEBOOK_FAIL.success
        output.status = statusCode.SERVICE_STATUS.GET_NOTEBOOK_FAIL.status
        output.description = statusCode.SERVICE_STATUS.GET_NOTEBOOK_FAIL.description
        res.send(output);
    }
    logger.info("End of get user notebook list")
    return;
})

/**
 * 新增笔记本
 * userToken 用户编号
 * parentId 父级菜单ID
 * notebookName 笔记本名称
 */
router.post("/addNotebook",async (req,res)=>{
    logger.info("start add notebook:");

    let output={
        success:false,
        status:"",
        description:"",
        data:{
            update_time:''
        }
    }

    const notebookName = req.body.notebookName || '';
    const parentId = parseInt(req.body.parentId, 10) || 1;
    const index = parseInt(req.body.index, 10) || 0;
    const level = parseInt(req.body.level, 10) || 0;

    logger.info(`notebookName:${notebookName}`);
    logger.info(`parentId:${parentId}`);
    logger.info(`index:${index}`);
    logger.info(`level:${level}`);

    const t = await sqldb.sequelize.transaction();

    try {
        let userInfo = req.userInfo;
        let curTime = new Date().toLocaleString()
        
        const newAddNotebook = await sqldb.Notebook.create(
            {
                name:notebookName,
                parent_id:parentId,
                index:index,
                level:level,
                u_id:userInfo.id,
                time:curTime,
                update_time:curTime,
                status:1,
            },
            {
                transaction:t
            }
        );
        
        logger.info(`new added notebook info:${JSON.stringify(newAddNotebook)}`);
        let event = statusCode.EVENT_LIST.ADD_NOTEBOOK;
        await sqldb.operLog.create(
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
        logger.info("add notebook success,commit database success")
        output.success = statusCode.SERVICE_STATUS.ADD_NOTEBOOK_SUCCESS.success
        output.status = statusCode.SERVICE_STATUS.ADD_NOTEBOOK_SUCCESS.status
        output.description = statusCode.SERVICE_STATUS.ADD_NOTEBOOK_SUCCESS.description
        output.data.noteId = newAddNotebook.id
        res.send(output);
    } catch (error) {
        logger.error(`add notebook error:${error}`);
        t.rollback();
        output.success = statusCode.SERVICE_STATUS.ADD_NOTEBOOK_FAIL.success
        output.status = statusCode.SERVICE_STATUS.ADD_NOTEBOOK_FAIL.status
        output.description = statusCode.SERVICE_STATUS.ADD_NOTEBOOK_FAIL.description
        res.send(output);
    }
    logger.info("End of add notebook");
    return
})

/**
 * 笔记本重命名
 * userToken 用户编号
 * id 目标笔记本ID
 * newName 笔记本新名称
 */
router.post("/renameNotebook",async (req,res)=>{
    logger.info(`start rename notebook :${JSON.stringify(req.body)}`);

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
    inputInfo.newName = req.body.newName

    const t = await sqldb.sequelize.transaction();

    try {
        logger.info(`userInfo:${JSON.stringify(req.userInfo)}`);
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
            await sqldb.Notebook.update(
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
            let event = statusCode.EVENT_LIST.RENAME_NOTEBOOK;
            await sqldb.operLog.create(
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
            logger.info("rename notebook success,commit database success")
            output.success = statusCode.SERVICE_STATUS.UPDATE_NOTE_SUCCESS.success
            output.status = statusCode.SERVICE_STATUS.UPDATE_NOTE_SUCCESS.status
            output.description = statusCode.SERVICE_STATUS.UPDATE_NOTE_SUCCESS.description;
            output.data.update_time = curTime;
            res.send(output);
        }
    } catch (error) {
        logger.error(`rename notebook error:${error}`);
        t.rollback();
        output.success = statusCode.SERVICE_STATUS.UPDATE_NOTE_FAIL.success
        output.status = statusCode.SERVICE_STATUS.UPDATE_NOTE_FAIL.status
        output.description = statusCode.SERVICE_STATUS.UPDATE_NOTE_FAIL.description
        res.send(output);
    }
    logger.info("End of rename notebook");
    return
})

/**
 * 更新笔记本之间的关系
 */
router.post("/updateNotebookRelation",async (req,res)=>{
    let output={
        success:true,
        status:'',
        description:'',
    }
    logger.info(`start update Notebook Relation:${JSON.stringify(req.body)}`);
    //[{id,level,parent_id,index}]
    let notebookList = req.body.notebookList;
    //目标状态
    let userInfo = req.userInfo;
    
    logger.info(`start update notebook realtion=>${notebookList}`);

    if(0 == notebookList.length)
    {
        output.success = statusCode.SERVICE_STATUS.PARAM_ERROR.success
        output.status = statusCode.SERVICE_STATUS.PARAM_ERROR.status
        output.description = statusCode.SERVICE_STATUS.PARAM_ERROR.description
        return;
    }
    //无效状态定义
    const  invalidStatus = [0];
    let curTime = new Date().toLocaleString()

    const t = await sqldb.sequelize.transaction();
    
    try {
        for(let notebook of notebookList)
        {
            //更新
            await sqldb.Notebook.update(
                {
                    level:notebook.level,
                    parent_id:notebook.parent_id,
                    index:notebook.index,
                    update_time:curTime,
                },
                {
                    where:{
                        id: notebook.id,
                        u_id:userInfo.id,
                        status:{
                            [Op.notIn]:invalidStatus,
                        }
                    },
                    transaction:t
                }
            );
            //记录日志
            let event = statusCode.EVENT_LIST.UPDATE_NOTEBOOK_RELATION;
            await sqldb.operLog.create(
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
        t.commit();
        logger.info(`update notebooks relation,commit database success`)
        output.success = statusCode.SERVICE_STATUS.UPDATE_NOTE_SUCCESS.success
        output.status = statusCode.SERVICE_STATUS.UPDATE_NOTE_SUCCESS.status
        output.description = statusCode.SERVICE_STATUS.UPDATE_NOTE_SUCCESS.description;
    } catch (error) {
        t.rollback();
        logger.error(`update notebooks relation,occurs error=>${error},rollback`);
        output.success = statusCode.SERVICE_STATUS.UPDATE_NOTE_SUCCESS.success
        output.status = statusCode.SERVICE_STATUS.UPDATE_NOTE_SUCCESS.status
        output.description = statusCode.SERVICE_STATUS.UPDATE_NOTE_SUCCESS.description;
    }
    res.send(output);
    return;
})

module.exports=router;