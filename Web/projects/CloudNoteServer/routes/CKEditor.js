const express=require("express");
const crypto = require("crypto")
const stringRandom = require("string-random");
let redisOper =require("../utils/redisOper")

//数据库
var sqldb = require('../sqldb');

//邮箱操作
var mailOper =require("../utils/mail")
//状态码定义
var statusCode = require("./statusCode")
var router=express.Router();

//图片上传
router.post("/uploadPic",async(req,res)=>{
    console.log("user login service start",req.body);
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
                    u_id: userInfo.id,
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