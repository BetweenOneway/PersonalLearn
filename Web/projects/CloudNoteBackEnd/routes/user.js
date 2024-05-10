const express=require("express");
const crypto = require("crypto")
const redis = require('redis')

var query=require("./query");

var router=express.Router();

const LOGIN_SUCCESS = {status:'L_000', description:'登录成功'}
const LOGIN_FAIL = {status:'L_001', description:'登录失败'}
const LOGIN_LOG_CREATE_EXCEPTION = {status:'L_002', description:'登录日志创建失败'}
const LOGIN_LOG_LOGIN_SUCCESS_REDIS_EXCEPTION = {status:'L_003', description:'登录成功，缓存失败'}

const SELECT_SUCCESS = {status:'S_000', description:'查询成功'}
const SELECT_EXCEPTION = {status:'S_001', description:'查询异常'}
const SELECT_ERROR={status:'S_002', description:'查询错误'}
const SELECT_NONE={status:'S_003', description:'账号或密码错误'}

const ACCOUNT_CLOCK = {status:'A_001', description:'账号被锁定'}

//用户登录
router.get("/login",(req,res)=>{
    console.log(req.query);
    var userEmail = req.query.userEmail
    var userPassword = req.query.userPassword
    var output={
        status:'',
        description:'',
        userToken:'',
        userInfo:{}
      }
    // res.writeHead(200,{
    //     "Access-Control-Allow-Origin":"*",//可伪装成任意网址
    //     //内容类型      普通文本
    //     "Content-Type":"text/plain;charset=utf-8"//避免乱码
    // })

    if(0 == userEmail.length || 0 == userPassword)
    {
        output.status = SELECT_NONE.status
        output.description = SELECT_NONE.description
    }
    else{
        var sql = `select id,status from z_user where email=? and password = ?`

        query(sql,[userEmail,userPassword])
        .then(result=>{
            //用户不存在
            if(result.length == 0)
            {
                output.status = SELECT_NONE.status
                output.description = SELECT_NONE.description
            }
            else{
                //用户被锁定
                if(result.status == 0)
                {
                    output.status=ACCOUNT_CLOCK.status
                    output.description=ACCOUNT_CLOCK.description
                }
                //用户存在且状态正常
                var userId = result.id;
                var curTime = new Date();

                var sql = `insert into z_user_log(desc,time,event,u_id) VALUES(?,?,?,?)`
                query(sql,['登录成功',curTime.toLocalDate(),'邮箱密码登录',userId]).then(result=>{
                    if(result.affectedRows > 0)
                    {
                        console.log("记录事件成功")
                        //将登录信息存储到redis中 14天有效期
                        try {
                            const userTokenKey = 'userToken:' + crypto.randomUUID({ disableEntropyCache: true })
                            const redisClient = redis.createClient('6379', '127.0.0.1')
                            redisClient.on('error', err => {
                                console.error(err) // 打印监听到的错误信息
                            })

                            redisClient.setEx(userTokenKey,14*24*60*60,JSON.stringify(result))
                            output.userToken = userTokenKey
                            output.userInfo = result
                            output.status = LOGIN_SUCCESS.status
                            output.description = LOGIN_SUCCESS.description
                        } catch (error) {
                            console.log(error)
                            output.status = LOGIN_LOG_LOGIN_SUCCESS_REDIS_EXCEPTION.status
                            output.description = LOGIN_LOG_LOGIN_SUCCESS_REDIS_EXCEPTION.description
                        }
                        
                    }
                    else{
                        output.status = LOGIN_LOG_CREATE_EXCEPTION.status
                        output.description = LOGIN_LOG_CREATE_EXCEPTION.description
                    }
                })
            }
            res.send(output);
        })
    }
})
module.exports=router;