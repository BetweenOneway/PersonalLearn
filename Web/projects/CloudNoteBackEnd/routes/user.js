const express=require("express");
const crypto = require("crypto")
const redis = require('redis')

var pool = require("../pool");
//var query=require("./query");

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
router.post("/login",(req,res)=>{
    console.log(req.body);
    var userEmail = req.body.userEmail
    var userPassword = req.body.userPassword
    var output={
        status:'',
        description:'',
        userToken:'',
        userInfo:{}
    }

    if(0 == userEmail.length || 0 == userPassword.length)
    {
        output.status = SELECT_NONE.status
        output.description = SELECT_NONE.description
        res.send(output);
    }
    else
    {
        pool.getConnection(function(error,connection){
            connection.beginTransaction(function(err) {
                if (err) { throw err; }
                var sql = `select id,status from z_user where email=? and password = ?`
                connection.query(sql, [userEmail,userPassword], function (error, results, fields) {
                    if (error || results.length == 0) {
                        return connection.rollback(function() {
                            output.status = SELECT_NONE.status
                            output.description = SELECT_NONE.description
                            res.send(output);
                        });
                    }
                    if(results[0].status == 0)
                    {
                        output.status=ACCOUNT_CLOCK.status
                        output.description=ACCOUNT_CLOCK.description
                        res.send(output);
                    }
                    console.log(results)
                    var userInfo = results[0];
                    var date = new Date();
                    var sql = `insert into z_user_log(\`desc\`,\`time\`,\`event\`,\`u_id\`) VALUES(?,?,?,?)`
                    connection.query(sql, ['登录成功',date.toISOString().slice(0, 19).replace('T', ' '),'邮箱密码登录',userInfo.id], function (error, results, fields) {
                        if (error) {
                            console.log(error)
                            return connection.rollback(function() {
                                output.status = LOGIN_LOG_LOGIN_SUCCESS_REDIS_EXCEPTION.status
                                output.description = LOGIN_LOG_LOGIN_SUCCESS_REDIS_EXCEPTION.description
                                res.send(output)
                            });
                        }
                        connection.commit(function(err) {
                            if (err) {
                                return connection.rollback(function() {
                                throw err;
                                });
                            }
                            (async function(){
                                try {
                                    const userTokenKey = 'userToken:' + crypto.randomUUID({ disableEntropyCache: true })
                                    const redisClient = redis.createClient('6379', '127.0.0.1')
                                    await redisClient.connect()
                                    redisClient.on('error', err => {
                                        console.error(err) // 打印监听到的错误信息
                                    })
                                    redisClient.setEx(userTokenKey,14*24*60*60,JSON.stringify(userInfo))
                                    output.userToken = userTokenKey
                                    output.userInfo = userInfo
                                    output.status = LOGIN_SUCCESS.status
                                    output.description = LOGIN_SUCCESS.description
                                    res.send(output)
                                } catch (error) {
                                    console.log(error)
                                    output.status = LOGIN_LOG_LOGIN_SUCCESS_REDIS_EXCEPTION.status
                                    output.description = LOGIN_LOG_LOGIN_SUCCESS_REDIS_EXCEPTION.description
                                    res.send(output)
                                }
                            })()
                        });
                    });
                });
           })
        })
    }
    
})
module.exports=router;