const express=require("express");
const { Op } = require("sequelize");

//数据库
var sqldb = require('../sqldb');

let statusCode = require("./statusCode")

var router=express.Router();

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
        //恢复便签
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

    console.log("End of restore files")
    return
})

module.exports=router;