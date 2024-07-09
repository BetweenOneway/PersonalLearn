const express=require("express");
const crypto = require("crypto")
const redis = require('redis')
const stringRandom = require("string-random");
let redisOper =require("../utils/redisOper")

//数据库
var sqldb = require('../sqldb');

//邮箱操作
var mailOper =require("../utils/mail")
//状态码定义
var statusCode = require("./statusCode")
var router=express.Router();

const REGISTER_SEND_VERIFY_CODE_SUCCESS =  {success:true, status:'R_001', description:'验证码发送成功'}
const REGISTER_REDIS_ERROR =  {success:false, status:'R_002', description:'注册验证码缓存失败'}

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
router.post("/login",async(req,res)=>{
    console.log("user login service start")
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

    //校验输入参数
    if(0 == userEmail.length || 0 == userPassword.length)
    {
        console.log("user login:param error")
        output.success = statusCode.SERVICE_STATUS.REQ_PARAM_ERROR.success
        output.status = statusCode.SERVICE_STATUS.REQ_PARAM_ERROR.status
        output.description = statusCode.SERVICE_STATUS.REQ_PARAM_ERROR.description
        res.send(output);
    }
    else
    {
        //事务处理
        const t = await sqldb.sequelize.transaction();
        try {
            const users = await sqldb.User.findAll(
                {
                    attributes: ['id', 'email','nickname','head_pic','level','time','status'],
                    where: {
                        email: userEmail,
                        password:userPassword
                    }
                }
            );
            if (users.length == 0) {
                console.log("login account password not matched")
                output.success = statusCode.SERVICE_STATUS.ACCOUNT_PASSWORD_NOT_MATCHED.success
                output.status = statusCode.SERVICE_STATUS.ACCOUNT_PASSWORD_NOT_MATCHED.status
                output.description = statusCode.SERVICE_STATUS.ACCOUNT_PASSWORD_NOT_MATCHED.description
                res.send(output);
                return
            }
            //账号状态异常
            if(users[0].status == 0)
            {
                console.log("login account locked")
                output.success = statusCode.SERVICE_STATUS.ACCOUNT_CLOCK.success
                output.status=statusCode.SERVICE_STATUS.ACCOUNT_CLOCK.status
                output.description=statusCode.SERVICE_STATUS.ACCOUNT_CLOCK.description
                res.send(output);
                return
            }
            var userInfo = users[0];
            var curDate = new Date().toLocaleString();
            //记录用户登录日志
            await sqldb.UserLog.create(
                {
                    u_id: users[0].id,
                    desc: '新增用户',
                    time:curDate,
                    event:'用户注册'
                }, 
                { 
                    transaction: t 
                }
            );
            await t.commit();
            //设置reddis缓存
            (async function(){
                try {
                    console.log("user login:set redis")
                    const userTokenKey = 'userToken:' + crypto.randomUUID({ disableEntropyCache: true })
                    await redisOper.RedisSet(userTokenKey,JSON.stringify(userInfo),14*24*60*60)
                    console.log("user login:set redis success")
                    output.userToken = userTokenKey
                    output.userInfo = userInfo
                    output.success = statusCode.SERVICE_STATUS.LOGIN_SUCCESS.success
                    output.status = statusCode.SERVICE_STATUS.LOGIN_SUCCESS.status
                    output.description = statusCode.SERVICE_STATUS.LOGIN_SUCCESS.description
                    res.send(output)
                } catch (error) {
                    console.log("user login:set redis error")
                    console.log(error)
                    output.success = statusCode.REDIS_STATUS.SET_FAIL.success
                    output.status = statusCode.REDIS_STATUS.SET_FAIL.status
                    output.description = statusCode.REDIS_STATUS.SET_FAIL.description
                    res.send(output)
                }
            })()
        } catch (error) {
            //出错处理
            console.log("user login error:",error)
            await t.rollback();
            output.success = statusCode.SERVICE_STATUS.LOGIN_FAIL.success
            output.status = statusCode.SERVICE_STATUS.LOGIN_FAIL.status
            output.description = statusCode.SERVICE_STATUS.LOGIN_FAIL.description
            res.send(output)
        }
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
                const redisClient = redis.createClient('6379', '127.0.0.1')
                await redisClient.connect()
                redisClient.on('error', err => {
                    console.error(err) // 打印监听到的错误信息
                })
                //删除key
                redisClient.del(userToken).then(val=>{
                    console.log("del userToken")
                    console.log(val)
                    
                    output.success = statusCode.SERVICE_STATUS.LOGOUT_SUCCESS.success
                    output.status = statusCode.SERVICE_STATUS.LOGOUT_SUCCESS.status
                    output.description = statusCode.SERVICE_STATUS.LOGOUT_SUCCESS.description
                    res.send(output)
                })
            } catch (error) {
                console.log("退出登录，缓存删除失败")
                console.log(error)
                output.success = statusCode.REDIS_STATUS.DEL_FAIL.success
                output.status = statusCode.REDIS_STATUS.DEL_FAIL.status
                output.description = statusCode.REDIS_STATUS.DEL_FAIL.description
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
                    output.success = statusCode.SERVICE_STATUS.MAIL_USED.success
                    output.status=statusCode.SERVICE_STATUS.MAIL_USED.status
                    output.description=statusCode.SERVICE_STATUS.MAIL_USED.description
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
                        output.success = statusCode.SERVICE_STATUS.MAIL_USED.success
                        output.status=statusCode.SERVICE_STATUS.MAIL_USED.status
                        output.description=statusCode.SERVICE_STATUS.MAIL_USED.description
                        res.send(output)
                    }
                    else
                    {
                        //用户注册
                        let curDate = new Date().toLocaleString();
                        let notEncryptedPassword = stringRandom(8, {letters:true,numbers: false,specials:true});
                        //密码加密
                        let encryptedPassword = cryptPwd(notEncryptedPassword);
                        connection.beginTransaction(function(err){
                            //用户表中新增用户记录
                            let sql = `insert into z_user(\`email\`,\`password\`,\`time\`) VALUES(?,?,?)`
                            connection.query(sql, [userEmail,encryptedPassword,curDate], function (error, results, fields) {
                                if (error) {
                                    console.log(error)
                                    return connection.rollback(function() {
                                        output.success = statusCode.SERVICE_STATUS.REGISTER_FAIL.success
                                        output.status = statusCode.SERVICE_STATUS.REGISTER_FAIL.status
                                        output.description = statusCode.SERVICE_STATUS.REGISTER_FAIL.description
                                        res.send(output)
                                    });
                                }
                                console.log("insert z_user") 
                                console.log(results)
                                console.log(fields)
                                //获取新增的用户ID
                                var sql = `select id as userId from z_user where email=?`
                                connection.query(sql, [userEmail], function (error, results, fields) {
                                    if (error) {
                                        console.log("get id error:")
                                        console.log(error)
                                        return connection.rollback(function() {
                                            output.success = statusCode.SERVICE_STATUS.REGISTER_FAIL.success
                                            output.status = statusCode.SERVICE_STATUS.REGISTER_FAIL.status
                                            output.description = statusCode.SERVICE_STATUS.REGISTER_FAIL.description
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
                                                        output.success = statusCode.SERVICE_STATUS.REGISTER_FAIL.success
                                                        output.status = statusCode.SERVICE_STATUS.REGISTER_FAIL.status
                                                        output.description = statusCode.SERVICE_STATUS.REGISTER_FAIL.description
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
                                                        output.success = statusCode.SERVICE_STATUS.REGISTER_SUCCESS.success
                                                        output.status = statusCode.SERVICE_STATUS.REGISTER_SUCCESS.status
                                                        output.description = statusCode.SERVICE_STATUS.REGISTER_SUCCESS.description
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