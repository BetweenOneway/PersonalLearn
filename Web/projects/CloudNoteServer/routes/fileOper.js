const express=require("express");
const { Op } = require("sequelize");

//数据库
var sqldb = require('../sqldb');

let statusCode = require("./statusCode")

var router=express.Router();

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

    let isCompleteDel = req.query.complete;
    //[{id,title,type,key,theme,icon,tip},{}...]
    let toDeleteFiles = req.query.files;
    //目标状态
    let userInfo = req.userInfo;

    /*
    const rows = await sqldb.Note.destroy(
        {
            where:{
                type:1,
                id:fileInfo.id,
            },
            transaction:t
        }
    );
    */

    try {
        const t = await sqldb.sequelize.transaction();
        let curTime = new Date().toLocaleString()
        let targetStatus = isCompleteDel? -1:0

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

        //数据为空
        if(noteIdList.length == 0 && memoIdList.length == 0)
        {
            output.success = statusCode.SERVICE_STATUS.DEL_NOTE_FAIL.success
            output.status = statusCode.SERVICE_STATUS.DEL_NOTE_FAIL.status
            output.description = statusCode.SERVICE_STATUS.DEL_NOTE_FAIL.description
            res.send(output);
            return;
        }
        let noteUpdateNum = 0;
        let memoUpdateNum = 0;

        //笔记
        if(noteIdList.length != 0)
        {
            noteUpdateNum = await sqldb.Note.update(
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
        //删除便签
        if(memoIdList.length != 0)
        {
            //便签
            memoUpdateNum = await sqldb.Memo.update(
                {
                    status:targetStatus,
                    update_time:curTime
                },
                {
                    where:{
                        id:fileInfo.id,
                        u_id:userInfo.id,
                        status:{
                            [Op.ne]:targetStatus
                        }
                    },
                    transaction:t
                }
            );
        }

        if((memoIdList.length != 0 && memoUpdateNum != memoIdList.length) 
            || (noteIdList.length != 0 && noteUpdateNum != noteIdList.length))
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
            let event = isCompleteDel? statusCode.EVENT_LIST.NOTE_COMPEL_DEL : statusCode.EVENT_LIST.NOTE_DEL;
            let logList = [];
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
            const operNum = await sqldb.operLog.bulkCreate(logList,
                {
                    transaction:t
                }
            );

            console.log("operNum:",operNum);

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

module.exports=router;