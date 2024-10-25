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

    let toDeleteFiles = req.query.data;
    //目标状态
    let userInfo = req.userInfo;

    const t = await sqldb.sequelize.transaction();
    try {
        let userInfo = validateInfo.userInfo;
        let curTime = new Date().toLocaleString()
        let targetStatus = isCompleteDel? -1:0

        const updateNum = await sqldb.Note.update(
            {
                status:targetStatus,
                update_time:curTime
            },
            {
                where:{
                    id:noteId,
                    u_id:userInfo.id,
                    status:{
                        [Op.ne]:targetStatus
                    }
                },
                transaction:t
            }
        );
        if(updateNum>0)
        {
            let event = isCompleteDel? statusCode.EVENT_LIST.NOTE_COMPEL_DEL : statusCode.EVENT_LIST.NOTE_DEL;
            const users = await sqldb.operLog.create(
                {
                    time:curTime,
                    event:event.code,
                    desc:event.desc,
                    u_id:userInfo.id,
                    o_id:noteId,
                    type:1
                },
                {
                    transaction:t
                }
            );

            t.commit();
            output.success = statusCode.SERVICE_STATUS.DEL_NOTE_SUCCESS.success
            output.status = statusCode.SERVICE_STATUS.DEL_NOTE_SUCCESS.status
            output.description = statusCode.SERVICE_STATUS.DEL_NOTE_SUCCESS.description
            res.send(output);
        }
        else{
            console.log("Delete note:updateNum=",updateNum);
            t.rollback();
            output.success = statusCode.SERVICE_STATUS.DEL_NOTE_FAIL.success
            output.status = statusCode.SERVICE_STATUS.DEL_NOTE_FAIL.status
            output.description = statusCode.SERVICE_STATUS.DEL_NOTE_FAIL.description
            res.send(output);
        }
    } catch (error) {
        console.log(error)

        t.rollback();
        output.success = statusCode.SERVICE_STATUS.DEL_NOTE_FAIL.success
        output.status = statusCode.SERVICE_STATUS.DEL_NOTE_FAIL.status
        output.description = statusCode.SERVICE_STATUS.DEL_NOTE_FAIL.description
        res.send(output);
    }
    console.log("End of delete files")
    return
})
module.exports=router;