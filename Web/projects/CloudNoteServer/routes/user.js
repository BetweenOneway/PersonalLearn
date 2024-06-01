const express=require("express");
const crypto = require("crypto")
const redis = require('redis')
const stringRandom = require("string-random");

var pool = require("../pool");
var mailOper =require("./mail");

var router=express.Router();

const LOGIN_SUCCESS = {success:true, status:'LOGIN_000', description:'登录成功'}
const LOGIN_FAIL = {success:false, status:'LOGIN_001', description:'登录失败'}
const LOGIN_LOG_CREATE_EXCEPTION = {success:false, status:'LOGIN_002', description:'登录日志创建失败'}
const LOGIN_LOG_LOGIN_SUCCESS_REDIS_EXCEPTION = {success:false, status:'LOGIN_003', description:'登录成功，缓存失败'}
const LOGIN_OUT_EXCEPTION = {success:false, status:'LOGIN_004', description:'退出登录异常'}
const LOGIN_OUT_SUCCESS = {success:true, status:'LOGIN_005', description:'退出登录成功'}

const SELECT_SUCCESS = {success:true, status:'Q_000', description:'查询成功'}
const SELECT_EXCEPTION = {success:false, status:'Q_001', description:'查询异常'}
const SELECT_ERROR={success:false, status:'Q_002', description:'查询错误'}
const SELECT_NONE={success:false, status:'Q_003', description:'账号或密码错误'}

const ACCOUNT_CLOCK = {success:false, status:'A_001', description:'账号被锁定'}
const ACCOUNT_MAIL_USED = {success:false, status:'A_002',description:'该邮箱已经被注册'}
const ACCOUNT_NEW_ADD_FAIL = {success:false, status:'A_003',description:'新增用户失败'}

const REGISTER_SUCCESS = {success:true,status:'R_000',description:'用户注册成功'}
const REGISTER_SEND_VERIFY_CODE_SUCCESS =  {success:true, status:'R_001', description:'验证码发送成功'}
const REGISTER_REDIS_ERROR =  {success:false, status:'R_002', description:'注册验证码缓存失败'}
const REGISTER_FAIL = {success:false,status:'R_003',description:'用户注册失败'}

const SERVICE_QUERY_FAIL = {success:false, status:'S_001',description:'查询服务异常'}
const SERVICE_MAIL_SEND_FAIL = {success:false, status:'S_002',description:'邮件发送异常'}
const SERVICE_DATA_BASE_EXCEPTION = {success:false, status:'S_003',description:'数据库服务异常'}

const LOG_INSERT_FAIL = {success:false, status:'LOG_002', description:'日志创建失败'}

const REQ_PARAM_ERROR = {success:false,status:'REQ_001',description:'请求参数有误'}

//MD5加密
function cryptPwd(password) {
    var md5 = crypto.createHash('md5');
    return md5.update(password).digest('hex');
}

//用户登录
router.post("/login",(req,res)=>{
    console.log(req.body);
    var userEmail = req.body.userEmail
    var userPassword = req.body.userPassword
    var output={
        success:false,
        status:'',
        description:'',
        userToken:'',
        userInfo:{}
    }

    if(0 == userEmail.length || 0 == userPassword.length)
    {
        output.success = SELECT_NONE.success
        output.status = SELECT_NONE.status
        output.description = SELECT_NONE.description
        res.send(output);
    }
    else
    {
        pool.getConnection(function(error,connection){
            connection.beginTransaction(function(err) {
                if (err) { throw err; }
                var sql = `select id,email,nickname as nickName,head_pic as headPic,level,time,status from z_user where email=? and password = ?`
                connection.query(sql, [userEmail,userPassword], function (error, results, fields) {
                    if (error || results.length == 0) {
                        return connection.rollback(function() {
                            output.success = SELECT_NONE.success
                            output.status = SELECT_NONE.status
                            output.description = SELECT_NONE.description
                            res.send(output);
                        });
                    }
                    if(results[0].status == 0)
                    {
                        output.success = ACCOUNT_CLOCK.success
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
                                output.success = LOGIN_LOG_LOGIN_SUCCESS_REDIS_EXCEPTION.success
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
                                    output.success = LOGIN_SUCCESS.success
                                    output.status = LOGIN_SUCCESS.status
                                    output.description = LOGIN_SUCCESS.description
                                    res.send(output)
                                } catch (error) {
                                    console.log(error)
                                    output.success = LOGIN_LOG_LOGIN_SUCCESS_REDIS_EXCEPTION.success
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

//退出登录
router.get("/logout",(req,res)=>{
    var output={
        success:true,
        status:'',
        description:''
    }
    console.log(req.query);
    var userToken = req.query.userToken
    if(!userToken && userToken==="" )
    {
        output.success = REQ_PARAM_ERROR.success
        output.status = REQ_PARAM_ERROR.status
        output.description = REQ_PARAM_ERROR.description
        res.send(output)
        return
    }
    try {
        (async function(){
            try {
                const userTokenKey = 'userToken:' + crypto.randomUUID({ disableEntropyCache: true })
                const redisClient = redis.createClient('6379', '127.0.0.1')
                await redisClient.connect()
                redisClient.on('error', err => {
                    console.error(err) // 打印监听到的错误信息
                })
                //删除key
                redisClient.del(userToken).then(val=>{
                    console.log("del userToken")
                    console.log(val)
                    
                    output.success = LOGIN_OUT_SUCCESS.success
                    output.status = LOGIN_OUT_SUCCESS.status
                    output.description = LOGIN_OUT_SUCCESS.description
                    res.send(output)
                })
            } catch (error) {
                console.log(error)
                output.success = LOGIN_LOG_LOGIN_SUCCESS_REDIS_EXCEPTION.success
                output.status = LOGIN_LOG_LOGIN_SUCCESS_REDIS_EXCEPTION.status
                output.description = LOGIN_LOG_LOGIN_SUCCESS_REDIS_EXCEPTION.description
                res.send(output)
            }
        })()
    } catch (error) {
        console.log(error)
    }
})

//发送验证码
router.get("/SendVerifyCode",(req,res)=>{
    var output={
        success:true,
        status:'',
        description:'',
        data:{
            userToken:''
        }
    }
    console.log(req.query);
    var userEmail = req.query.userEmail
    pool.getConnection(function(error,connection){
        if(error)
        {
            //数据库连接失败
            console.log(error)
            output.success = SERVICE_DATA_BASE_EXCEPTION.success
            output.status = SERVICE_DATA_BASE_EXCEPTION.status
            output.description = SERVICE_DATA_BASE_EXCEPTION.description
            res.send(output)
            throw error
        }
        //验证邮箱是否可用
        var sql = `select count(1) as userCount from z_user where email=?`
        connection.query(sql, [userEmail], function (error, results, fields) {
            if (error) {
                //查询服务异常
                output.success = SERVICE_QUERY_FAIL.success
                output.status = SERVICE_QUERY_FAIL.status
                output.description = SERVICE_QUERY_FAIL.description
            }
            else
            {
                console.log("send Verify check if mail used")
                console.log(results)
                if(results[0].userCount >= 1)
                {
                    console.log(results)
                    //邮箱被占用
                    output.success = ACCOUNT_MAIL_USED.success
                    output.status=ACCOUNT_MAIL_USED.status
                    output.description=ACCOUNT_MAIL_USED.description
                }
                else
                {
                    //生成随机验证码
                    let verifyCode = stringRandom(8, {letters:true,numbers: false,specials:false});
                    let resultInfo = {};
                    mailOper.SendEmail({email:userEmail,subject:"注册验证码",text:verifyCode,html:""},resultInfo)
                    if(0 != resultInfo.statusCode)
                    {
                        output.success = SERVICE_MAIL_SEND_FAIL.success
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
                            output.success = REGISTER_SEND_VERIFY_CODE_SUCCESS.success
                            output.status = REGISTER_SEND_VERIFY_CODE_SUCCESS.status
                            output.description = REGISTER_SEND_VERIFY_CODE_SUCCESS.description
                            output.data.userToken = userTokenKey
                        }
                        catch(e)
                        {
                            console.log(e)
                            output.success = REGISTER_REDIS_ERROR.success
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

    let output={
        success:false,
        status:"",
        description:""
    }

    //参数校验
    if(userEmail.length == 0)
    {
        console.log("mail length == 0")
    }
    else if(verifyCode.length == 0 || verifyCodeKey.length == 0)
    {
        //接收验证码邮箱与注册邮箱是否相同
        //验证码是否相同
        console.log("verifycode length == 0")
    }
    else
    {
        pool.getConnection((error,connection)=>{
            //验证邮箱是否可用
            var sql = `select count(1) as userCount from z_user where email=?`
            connection.query(sql, [userEmail], function (error, results, fields) {
                if (error) {
                    //查询服务异常
                    output.success = SERVICE_QUERY_FAIL.success
                    output.status = SERVICE_QUERY_FAIL.status
                    output.description = SERVICE_QUERY_FAIL.description
                    res.send(output)
                }
                else
                {
                    if(results.userCount == 1)
                    {
                        //邮箱被占用
                        output.success = ACCOUNT_MAIL_USED.success
                        output.status=ACCOUNT_MAIL_USED.status
                        output.description=ACCOUNT_MAIL_USED.description
                        res.send(output)
                    }
                    else
                    {
                        //用户注册
                        let curDate = new Date();
                        let notEncryptedPassword = stringRandom(8, {letters:true,numbers: false,specials:true});
                        //密码加密
                        let encryptedPassword = cryptPwd(notEncryptedPassword);
                        connection.beginTransaction(function(err){
                            //用户表中新增用户记录
                            let sql = `insert into z_user(\`email\`,\`password\`,\`time\`) VALUES(?,?,?)`
                            connection.query(sql, [userEmail,encryptedPassword,curDate.toISOString().slice(0, 19).replace('T', ' ')], function (error, results, fields) {
                                if (error) {
                                    console.log(error)
                                    return connection.rollback(function() {
                                        output.success = ACCOUNT_NEW_ADD_FAIL.success
                                        output.status = ACCOUNT_NEW_ADD_FAIL.status
                                        output.description = ACCOUNT_NEW_ADD_FAIL.description
                                        res.send(output)
                                    });
                                }
                                console.log("insert z_user") 
                                console.log(results)
                                console.log(fields)
                                var sql = `select id as userId from z_user where email=?`
                                connection.query(sql, [userEmail], function (error, results, fields) {
                                    if (error) {
                                        console.log("get id error:")
                                        console.log(error)
                                        return connection.rollback(function() {
                                            output.success = ACCOUNT_NEW_ADD_FAIL.success
                                            output.status = ACCOUNT_NEW_ADD_FAIL.status
                                            output.description = ACCOUNT_NEW_ADD_FAIL.description
                                            res.send(output)
                                        });
                                    }
                                    console.log("select id:")
                                    console.log(results)

                                    let user_Id = results[0].userId
                                    console.log("user id="+user_Id);
                                    //记录新增用户记录
                                    sql = `insert into z_user_log(\`desc\`,\`time\`,\`event\`,\`u_id\`) VALUES(?,?,?,?)`
                                    connection.query(sql, ['用户注册成功',curDate.toISOString().slice(0, 19).replace('T', ' '),'用户注册',user_Id], function (error, results, fields) {
                                        if (error) {
                                            console.log("insert z_user_log error")
                                            console.log(error)
                                            return connection.rollback(function() {
                                                output.success = LOG_INSERT_FAIL.success
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
                                                        console.log("commit database error")
                                                        output.success = ACCOUNT_NEW_ADD_FAIL.success
                                                        output.status = ACCOUNT_NEW_ADD_FAIL.status
                                                        output.description = ACCOUNT_NEW_ADD_FAIL.description
                                                        res.send(output)
                                                    });
                                                }
                                                else{
                                                    //邮箱通知用户新注册账号的密码
                                                    let resultInfo = {};
                                                    let mailContent = "<p>尊敬的 "+userEmail+":</p>"
                                                    +"<p>您已成功注册之间账号，其初始密码为：<b style='font-size:20px;color:blue;'>"
                                                    +notEncryptedPassword+"</b>。</p>"
                                                    +'<p color="red">请及时登录并修改登录密码！</p>'
                                                    mailOper.SendEmail({email:userEmail,subject:"账号注册成功通知",text:"",html:mailContent},resultInfo)
                                                    if(0 != resultInfo.statusCode)
                                                    {
                                                        console.log("mail send fail")
                                                        output.success = SERVICE_MAIL_SEND_FAIL.success
                                                        output.status = SERVICE_MAIL_SEND_FAIL.status
                                                        output.description = SERVICE_MAIL_SEND_FAIL.description
                                                        res.send(output)
                                                    }
                                                    else
                                                    {
                                                        console.log("mail send success,user account register success")
                                                        output.success = REGISTER_SUCCESS.success
                                                        output.status = REGISTER_SUCCESS.status
                                                        output.description = REGISTER_SUCCESS.description
                                                        console.log(output)
                                                        res.send(output)
                                                    }
                                                }
                                            })
                                        }
                                    })
                                })
                            })
                        })
                    }
                }
                //在这里会直接发送失败，尽管前面已经注册成功 貌似存在异步问题
                console.log(output)
                //res.send(output)
            })
        })
    }
    
})

module.exports=router;