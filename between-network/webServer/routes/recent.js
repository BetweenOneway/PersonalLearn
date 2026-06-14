const express=require("express");
const { Op } = require("sequelize");

//数据库
var sqldb = require('../sqldb');

let statusCode = require("./statusCode")

var router=express.Router();

/**
 * 获取指定用户最近访问的文件
 */
router.get("/getRecentAccessFiles",async (req,res)=>{
    console.log("start getRecentAccessFiles");

    let output={
        success:false,
        status:"",
        description:"",
        data:[]
    }

    try {
        let userInfo = req.userInfo
        console.log("parsed userinfo")
        console.log(userInfo)

        const recentFiles = await sqldb.RecentFiles.findAll(
            {
                attributes: ['id', 'title','type',['update_time','time']],
                where:{
                    u_id:userInfo.id
                },
                order:[
                    ['update_time','DESC']
                ],
                raw:true,
            }
        );
        output.success = statusCode.SERVICE_STATUS.GET_NOTE_SUCCESS.success
        output.status = statusCode.SERVICE_STATUS.GET_NOTE_SUCCESS.status
        output.description = statusCode.SERVICE_STATUS.GET_NOTE_SUCCESS.description

        output.data = recentFiles
        res.send(output);
    } catch (error) {
        console.log(error)
        output.success = statusCode.SERVICE_STATUS.GET_NOTE_FAIL.success
        output.status = statusCode.SERVICE_STATUS.GET_NOTE_FAIL.status
        output.description = statusCode.SERVICE_STATUS.GET_NOTE_FAIL.description
        res.send(output);
    }
    console.log("End of getRecentAccessFiles")
    return;
})

module.exports=router;