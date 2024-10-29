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

module.exports=router;