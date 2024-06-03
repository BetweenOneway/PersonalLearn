const express=require("express");
const crypto = require("crypto")
const redis = require('redis')
const stringRandom = require("string-random");

var pool = require("../pool");
var redisOper =require("./redisOper");

var router=express.Router();

//获取用户所有正常的便签
router.get("/getUserMemoList",(req,res)=>{
    var output={
        success:true,
        status:'',
        description:''
    }
    console.log(req.query);
    var userId = req.query.userId
    let status = 1
    //验证用户是否登录
    let userTokenRedisValue = redisOper.RedisGet(userId)
    if(userTokenRedisValue == null)
    {
        //用户未登录
        return
    }
    //查询当前用户的所有正常的便签
    //置顶在前 未完成在前 时间越近的越在前
    var sql = `SELECT * from z_thing WHERE u_id = ? AND status= ? ORDER BY top ASC,finished ASC,update_time DESC;`
    pool.getConnection(function(error,connection){
        connection.query(sql, [userId,status], function (error, results, fields) {
            if (error) {
                return connection.rollback(function() {
                    output.success = SELECT_NONE.success
                    output.status = SELECT_NONE.status
                    output.description = SELECT_NONE.description
                    res.send(output);
                });
            }
            console.log(results)
            return
        })
    })
})
module.exports=router;