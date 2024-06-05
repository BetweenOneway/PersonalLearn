const express=require("express");
const crypto = require("crypto")
const redis = require('redis')
const stringRandom = require("string-random");

var pool = require("../pool");
var redisOper =require("./redisOper");
let statusCode = require("../statusCode")

var router=express.Router();

//获取用户所有正常的便签
router.get("/getUserMemoList",(req,res)=>{
    var output={
        success:true,
        status:'',
        description:''
    }
    console.log(req.query);
    var userToken = req.query.userToken
    let status = 1
    //验证用户是否登录
    try{
        let userTokenRedisValue = redisOper.RedisGet(userToken)
        if(userTokenRedisValue == null)
        {
            //用户未登录
            output.success = statusCode.SERVICE_STATUS.NOT_LOGIN.success
            output.status = statusCode.SERVICE_STATUS.NOT_LOGIN.status
            output.description = statusCode.SERVICE_STATUS.NOT_LOGIN.description
            res.send(output)
            return
        }
        console.log(userTokenRedisValue)
    }
    catch(error)
    {
        output.success = statusCode.REDIS_STATUS.GET_FAIL.success
        output.status = statusCode.REDIS_STATUS.GET_FAIL.status
        output.description = statusCode.REDIS_STATUS.GET_FAIL.description
        res.send(output)
        return
    }
    //查询当前用户的所有正常的便签
    //置顶在前 未完成在前 时间越近的越在前
    var sql = `SELECT id,title,top,tags,update_time,finished from z_thing WHERE u_id = ? AND status= ? ORDER BY top DESC,finished ASC,update_time DESC;`
    pool.getConnection(function(error,connection){
        connection.query(sql, [userId,status], function (error, results, fields) {
            if (error) {
                return connection.rollback(function() {
                    output.success = statusCode.DB_STATUS.SELECT_FAIL.success
                    output.status = statusCode.DB_STATUS.SELECT_FAIL.status
                    output.description = statusCode.DB_STATUS.SELECT_FAIL.description
                    res.send(output);
                });
            }
            console.log(results)
            output.success = statusCode.SERVICE_STATUS.GET_MEMO_SUCCESS.success
            output.status = statusCode.SERVICE_STATUS.GET_MEMO_SUCCESS.status
            output.description = statusCode.SERVICE_STATUS.GET_MEMO_SUCCESS.description
            res.send(output);
            return
        })
    })
})
module.exports=router;