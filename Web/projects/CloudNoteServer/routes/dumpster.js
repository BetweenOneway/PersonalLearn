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
                attributes: ['id','title',['update_time','updateTime'],'type'],
                where:{
                    u_id:userInfo.id
                },
                order:[
                    ['update_time','DESC']
                ],
                raw:true,
            }
        );
        output.data = fileLists;
        output.success = statusCode.SERVICE_STATUS.UPDATE_NOTE_FAIL.success
        output.status = statusCode.SERVICE_STATUS.UPDATE_NOTE_FAIL.status
        output.description = statusCode.SERVICE_STATUS.UPDATE_NOTE_FAIL.description
        res.send(output);

    } catch (error) {
        console.log("get dumpster file lists error:",error);
        t.rollback();
        output.success = statusCode.SERVICE_STATUS.UPDATE_NOTE_FAIL.success
        output.status = statusCode.SERVICE_STATUS.UPDATE_NOTE_FAIL.status
        output.description = statusCode.SERVICE_STATUS.UPDATE_NOTE_FAIL.description
        res.send(output);
    }
    console.log("End of Update note");
    return
})

module.exports=router;