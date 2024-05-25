const express=require("express");
const crypto = require("crypto")
const redis = require('redis')
const stringRandom = require("string-random");

var pool = require("../pool");
var mailOper =require("./mail");

var router=express.Router();

const LOGIN_SUCCESS = {status:'LOGIN_000', description:'登录成功'}
const LOGIN_FAIL = {status:'LOGIN_001', description:'登录失败'}
const LOGIN_LOG_CREATE_EXCEPTION = {status:'LOGIN_002', description:'登录日志创建失败'}
const LOGIN_LOG_LOGIN_SUCCESS_REDIS_EXCEPTION = {status:'LOGIN_003', description:'登录成功，缓存失败'}

const SELECT_SUCCESS = {status:'S_000', description:'查询成功'}
const SELECT_EXCEPTION = {status:'S_001', description:'查询异常'}
const SELECT_ERROR={status:'S_002', description:'查询错误'}
const SELECT_NONE={status:'S_003', description:'账号或密码错误'}

const ACCOUNT_CLOCK = {status:'A_001', description:'账号被锁定'}
const ACCOUNT_MAIL_USED = {status:'A_002',description:'该邮箱已经被注册'}
const ACCOUNT_NEW_ADD_FAIL = {status:'A_003',description:'新增用户失败'}
//const ACCOUNT_NEW_ADD_EXCEPTION = {status:'A_004',description:'新增用户异常'}

const REGISTER_SEND_VERIFY_CODE_SUCCESS =  {status:'R_001', description:'验证码发送成功'}
const REGISTER_REDIS_ERROR =  {status:'R_002', description:'注册验证码缓存失败'}

const SERVICE_QUERY_FAIL = {status:'F_001',description:'查询服务异常'}
const SERVICE_MAIL_SEND_FAIL = {status:'F_002',description:'邮件发送异常'}

const LOG_INSERT_FAIL = {status:'LOG_002', description:'日志创建失败'}

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

//发送验证码
router.get("/SendVerifyCode",(req,res)=>{
    var output={
        status:'',
        description:'',
        userToken:''
    }
    console.log(req.query);
    var userEmail = req.query.userEmail
    pool.getConnection((error,connection)=>{
        //验证邮箱是否可用
        var sql = `select count(1) from z_user where email=?`
        connection.query(sql, [userEmail], function (error, results, fields) {
            if (error) {
                //查询服务异常
                output.status = SERVICE_QUERY_FAIL.status
                output.description = SERVICE_QUERY_FAIL.description
            }
            else
            {
                if(results.length == 1)
                {
                    //邮箱被占用
                    output.status=ACCOUNT_MAIL_USED.status
                    output.description=ACCOUNT_MAIL_USED.description
                    res.send(output);
                }
                else
                {
                    //生成随机验证码
                    let verifyCode = random(8, {letters:true,numbers: false,specials:false});
                    let resultInfo = {};
                    mailOper.SendEmail({email:userEmail,subject:"注册验证码",text:verifyCode,html:""},resultInfo)
                    if(0 != resultInfo.statusCode)
                    {
                        output.status = SERVICE_MAIL_SEND_FAIL.status
                        output.description = SERVICE_MAIL_SEND_FAIL.description
                    }
                    else
                    {
                        try
                        {
                            //将验证码保存到Redis中
                            const userTokenKey = 'RegEmailToken:' + userEmail + ":" + crypto.randomUUID({ disableEntropyCache: true })
                            const redisClient = redis.createClient('6379', '127.0.0.1')
                            redisClient.connect()
                            redisClient.on('error', err => {
                                console.error(err) // 打印监听到的错误信息
                            })
                            //有效期15分钟
                            redisClient.setEx(userTokenKey,15*60,verifyCode)
                            output.status = REGISTER_SEND_VERIFY_CODE_SUCCESS.status
                            output.description = REGISTER_SEND_VERIFY_CODE_SUCCESS.description
                            output.userToken = userTokenKey
                        }
                        catch(e)
                        {
                            output.status = REGISTER_REDIS_ERROR.status
                            output.description= REGISTER_REDIS_ERROR.description
                        }
                    }
                }
            }
            res.send(output);
            return
        })
    })
})

//邮箱注册账号
router.post("/register",(req,res)=>{
    console.log(req.body);
    var userEmail = req.body?.userEmail??""
    let verifyCode = req.body?.verifyCode??""
    let verifyCodeKey = req.body?.verifyCodeKey??""

    //参数校验
    if(userEmail.length == 0)
    {
        
    }
    else if(verifyCode.length == 0 || verifyCodeKey.length == 0)
    {
        //接收验证码邮箱与注册邮箱是否相同
        //验证码是否相同
    }
    else
    {
        pool.getConnection((error,connection)=>{
            //验证邮箱是否可用
            var sql = `select count(1) from z_user where email=?`
            connection.query(sql, [userEmail], function (error, results, fields) {
                if (error) {
                    //查询服务异常
                    output.status = SERVICE_QUERY_FAIL.status
                    output.description = SERVICE_QUERY_FAIL.description
                }
                else
                {
                    if(results.length == 1)
                    {
                        //邮箱被占用
                        output.status=ACCOUNT_MAIL_USED.status
                        output.description=ACCOUNT_MAIL_USED.description
                        res.send(output);
                    }
                    else
                    {
                        

                        //用户注册
                        let curDate = new Date();
                        let notEncryptedPassword = random(8, {letters:true,numbers: false,specials:true});
                        //密码加密
                        let encryptedPassword;
                        connection.beginTransaction(function(err){
                            //用户表中新增用户记录
                            let sql = `insert into z_user(\`email\`,\`password\`,\`time\`) VALUES(?,?,?)`
                            connection.query(sql, [userEmail,encryptedPassword,curDate.toISOString().slice(0, 19).replace('T', ' ')], function (error, results, fields) {
                                if (error) {
                                    console.log(error)
                                    return connection.rollback(function() {
                                        output.status = ACCOUNT_NEW_ADD_FAIL.status
                                        output.description = ACCOUNT_NEW_ADD_FAIL.description
                                        res.send(output)
                                    });
                                }
                                //记录新增用户记录
                                let sql = `insert into z_user_log(\`desc\`,\`time\`,\`event\`,\`u_id\`) VALUES(?,?,?,?)`
                                connection.query(sql, ['用户注册成功',date.toISOString().slice(0, 19).replace('T', ' '),'用户注册',userInfo.id], function (error, results, fields) {
                                    if (error) {
                                        console.log(error)
                                        return connection.rollback(function() {
                                            output.status = LOG_INSERT_FAIL.status
                                            output.description = LOG_INSERT_FAIL.description
                                            res.send(output)
                                        });
                                    }
                                    else{
                                        connection.commit(function(err) {
                                            if (err) {
                                                return connection.rollback(function() {
                                                    //提交错误处理
                                                    output.status = ACCOUNT_NEW_ADD_FAIL.status
                                                    output.description = ACCOUNT_NEW_ADD_FAIL.description
                                                    res.send(output)
                                                });
                                            }
                                            else{
                                                //邮箱通知用户新注册账号的密码
                                                let resultInfo = {};
                                                let mailContent = "<p>尊敬的"+userEmail+":</p>"
                                                +"<p>您已成功注册之间账号，其初始密码为：<b style='font-size:20px;color:blue;'>"
                                                +notEncryptedPassword+"</b>。</p>"
                                                +"<p>请及时登录并修改登录密码！</p>"
                                                mailOper.SendEmail({email:userEmail,subject:"账号注册成功通知",text:"",html:mailContent},resultInfo)
                                                if(0 != resultInfo.statusCode)
                                                {
                                                    output.status = SERVICE_MAIL_SEND_FAIL.status
                                                    output.description = SERVICE_MAIL_SEND_FAIL.description
                                                }
                                            }
                                        })
                                    }
                                })
                                
                            })
                        })
                    }
                }
                res.send(output);
                return
            })
        })
    }
})
module.exports=router;