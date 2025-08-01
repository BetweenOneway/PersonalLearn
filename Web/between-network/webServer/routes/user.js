const express=require("express");
const crypto = require("crypto")
const stringRandom = require("string-random");

//邮箱操作
var mailOper =require("../utils/mail")
//状态码定义

var router=express.Router();

const path = require('path')
const fs = require('fs');

//MD5加密
function cryptPwd(password) {
    var md5 = crypto.createHash('md5');
    return md5.update(password).digest('hex');
}

//判断目录是否存在，不存在则创建
function checkDirectory(dirPath) {
    fs.access(dirPath,async(err)=>{
        if(err)
        {
            await fs.mkdir(dirPath, 
                { recursive: true },
                (err) => {
                    if (err) throw err;
                }
            );
        }
    })
}

//用户登录
router.post("/login",async(req,res)=>{
    logger.info("user login service start",req.body);
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
        logger.error("user login:param error")
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
            const userInfo = await sqldb.User.findOne(
                {
                    attributes: ['id', 'email',['nickname','nickName'],['head_pic','headPic'],'level','time','status','sex','birthday'],
                    where: {
                        email: userEmail,
                        password:userPassword
                    }
                }
            );
            logger.info(`get userInfo:${userInfo}`);
            if(!userInfo)
            {
                logger.error("account & password not matched")
                output.success = statusCode.SERVICE_STATUS.ACCOUNT_PASSWORD_NOT_MATCHED.success
                output.status=statusCode.SERVICE_STATUS.ACCOUNT_PASSWORD_NOT_MATCHED.status
                output.description=statusCode.SERVICE_STATUS.ACCOUNT_PASSWORD_NOT_MATCHED.description
                res.send(output);
                return
            }
            //账号状态异常
            if(userInfo.status == 0)
            {
                logger.error("login account locked")
                output.success = statusCode.SERVICE_STATUS.ACCOUNT_CLOCK.success
                output.status=statusCode.SERVICE_STATUS.ACCOUNT_CLOCK.status
                output.description=statusCode.SERVICE_STATUS.ACCOUNT_CLOCK.description
                res.send(output);
                return
            }
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
                    logger.info("user login:set redis")
                    const userTokenKey = 'userToken:' + crypto.randomUUID({ disableEntropyCache: true })
                    await redisOper.RedisSet(userTokenKey,JSON.stringify(userInfo),24*60*60)

                    logger.info("user login:set redis success")
                   
                    output.userToken = userTokenKey
                    output.userInfo = userInfo
                    output.success = statusCode.SERVICE_STATUS.LOGIN_SUCCESS.success
                    output.status = statusCode.SERVICE_STATUS.LOGIN_SUCCESS.status
                    output.description = statusCode.SERVICE_STATUS.LOGIN_SUCCESS.description
                    res.send(output)
                } catch (error) {
                    logger.error(`user login:set redis error=>${error}`)
                    console.log(error)
                    output.success = statusCode.REDIS_STATUS.SET_FAIL.success
                    output.status = statusCode.REDIS_STATUS.SET_FAIL.status
                    output.description = statusCode.REDIS_STATUS.SET_FAIL.description
                    res.send(output)
                }
            })()
        } catch (error) {
            //出错处理
            logger.error(`user login error=>${error}`)
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
    console.log("退出登录",req.query);
    var userToken = req.get('userToken')
    if(!userToken || userToken==="" )
    {
        output.success = statusCode.SERVICE_STATUS.PARAM_ERROR.success
        output.status = statusCode.SERVICE_STATUS.PARAM_ERROR.status
        output.description = statusCode.SERVICE_STATUS.PARAM_ERROR.description
        res.send(output)
        return
    }
    try {
        (async function(){
            try {
                await redisOper.RedisDel(userToken)
                output.success = statusCode.SERVICE_STATUS.LOGOUT_SUCCESS.success
                output.status = statusCode.SERVICE_STATUS.LOGOUT_SUCCESS.status
                output.description = statusCode.SERVICE_STATUS.LOGOUT_SUCCESS.description
                res.send(output)
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
router.get("/SendVerifyCode",async(req,res)=>{
    var output={
        success:true,
        status:'',
        description:'',
        data:{
            userToken:''
        }
    }
    console.log("获取验证码：",req.query);
    var userEmail = req.query.userEmail
    try {
        //查询邮箱是否被占用
        const matchedUserCount = await sqldb.User.count(
            {
                where:{
                    email:userEmail
                }
            }
        )
        if(matchedUserCount > 0)
        {
            //邮箱被占用
            output.success = statusCode.SERVICE_STATUS.MAIL_USED.success
            output.status=statusCode.SERVICE_STATUS.MAIL_USED.status
            output.description=statusCode.SERVICE_STATUS.MAIL_USED.description
        }
        else{
            //生成随机验证码
            let verifyCode = stringRandom(8, {letters:true,numbers: false,specials:false});
            try
            {
                //将验证码保存到Redis中
                const userTokenKey = 'RegEmailToken:' + userEmail + ":" + crypto.randomUUID({ disableEntropyCache: true })

                await redisOper.RedisSet(userTokenKey,verifyCode,15*60)

                //发送邮件
                let resultInfo = {};
                mailOper.SendEmail({email:userEmail,subject:"注册验证码",text:verifyCode,html:""},resultInfo)
                if(0 != resultInfo.statusCode)
                {
                    output.success = statusCode.REDIS_STATUS.SET_FAIL.success
                    output.status = statusCode.REDIS_STATUS.SET_FAIL.status
                    output.description= statusCode.REDIS_STATUS.SET_FAIL.description
                }
                else
                {
                    output.success = statusCode.SERVICE_STATUS.SEND_EMAIL_VC_SUCCESS.success
                    output.status = statusCode.SERVICE_STATUS.SEND_EMAIL_VC_SUCCESS.status
                    output.description= statusCode.SERVICE_STATUS.SEND_EMAIL_VC_SUCCESS.description
                    output.data.userToken = userTokenKey
                }
            }
            catch(e)
            {
                console.log(e)
                output.success = statusCode.REDIS_STATUS.SET_FAIL.success
                output.status = statusCode.REDIS_STATUS.SET_FAIL.status
                output.description= statusCode.REDIS_STATUS.SET_FAIL.description
            }
        }
    } catch (error) {
        console.log(error)
        output.success = statusCode.SERVICE_STATUS.SEND_EMAIL_VC_FAIL.success
        output.status = statusCode.SERVICE_STATUS.SEND_EMAIL_VC_FAIL.status
        output.description= statusCode.SERVICE_STATUS.SEND_EMAIL_VC_FAIL.description
    }
    res.send(output)
})

//邮箱注册账号
router.post("/register",async (req,res)=>{
    console.log("用户注册",req.body);
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
        const matchedUserCount = await sqldb.User.count(
            {
                where:{
                    email:userEmail
                }
            }
        )
        if(results.userCount == 1)
        {
            //邮箱被占用
            output.success = statusCode.SERVICE_STATUS.MAIL_USED.success
            output.status=statusCode.SERVICE_STATUS.MAIL_USED.status
            output.description=statusCode.SERVICE_STATUS.MAIL_USED.description
            
        }
        else
        {
            //用户注册
            try {
                let curDate = new Date().toLocaleString();
                const t = await sqldb.sequelize.transaction();
                //随机生成初始密码
                let notEncryptedPassword = stringRandom(8, {letters:true,numbers: false,specials:true});
                //密码加密
                let encryptedPassword = cryptPwd(notEncryptedPassword);
                //新增用户信息
                const user = await sqldb.User.create(
                    {
                        email:email,
                        password:encryptedPassword,
                        time:curDate,
                    },
                    {
                        //指定新增哪些字段
                        fields:['email','password','time'],
                        transaction: t
                    }
                );

                //获取新增用户ID
                const users = await sqldb.User.findAll(
                    {
                        attributes: ['id'],
                        where: {
                            email: email
                        },
                        transaction: t
                    }
                );
                //记录事件
                const userLog = await sqldb.UserLog.create(
                    {
                        desc:statusCode.EVENT_LIST.USER_REGIST.desc,
                        time:curDate,
                        event:statusCode.EVENT_LIST.USER_REGIST.code,
                        u_id:users.id
                    },
                    {
                        //指定新增哪些字段
                        fields:['desc','time','event','u_id'],
                        transaction: t
                    }
                );

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
                    output.success = statusCode.SERVICE_STATUS.MAIL_NOTIFICATION.success
                    output.status = statusCode.SERVICE_STATUS.MAIL_NOTIFICATION.status
                    output.description = statusCode.SERVICE_STATUS.MAIL_NOTIFICATION.description
                    t.rollback();
                }
                else
                {
                    console.log("mail send success,user account register success")
                    output.success = statusCode.SERVICE_STATUS.REGISTER_SUCCESS.success
                    output.status = statusCode.SERVICE_STATUS.REGISTER_SUCCESS.status
                    output.description = statusCode.SERVICE_STATUS.REGISTER_SUCCESS.description
                    t.commit();
                }
                
            } catch (error) {
                console.log("用户注册出错",error)
                t.rollback();
                output.success = statusCode.SERVICE_STATUS.REGISTER_FAIL.success
                output.status = statusCode.SERVICE_STATUS.REGISTER_FAIL.status
                output.description = statusCode.SERVICE_STATUS.REGISTER_FAIL.description
            }
        }
    }
    res.send(output)
})

/**
 * 获取用户基本信息
 */
router.get("/getUserInfo",async(req,res)=>{
    console.log("get User Info service start",req.query);

    var output={
        success:false,
        status:'',
        description:'',
        userInfo:{}
    }

    let userId = req.userInfo.id;

    {
        //事务处理
        const t = await sqldb.sequelize.transaction();
        try {
            const userBasicInfo = await sqldb.User.findOne(
                {
                    attributes: ['id','email',['nickname','nickName'],['head_pic','headPic'],'level','time','sex','birthday'],
                    where: {
                        id:userId,
                        status:1
                    }
                }
            );

            var curDate = new Date().toLocaleString();
            //记录用户登录日志
            const userLog = await sqldb.UserLog.create(
                {
                    desc:statusCode.EVENT_LIST.QUERY_USER_INFO.desc,
                    time:curDate,
                    event:statusCode.EVENT_LIST.QUERY_USER_INFO.code,
                    u_id:userId
                },
                {
                    //指定新增哪些字段
                    fields:['desc','time','event','u_id'],
                    transaction: t
                }
            );

            await t.commit();

            console.log("End of get user info")

            output.success = statusCode.SERVICE_STATUS.GET_USERINFO_SUCCESS.success
            output.status = statusCode.SERVICE_STATUS.GET_USERINFO_SUCCESS.status
            output.description = statusCode.SERVICE_STATUS.GET_USERINFO_SUCCESS.description
            output.userInfo = userBasicInfo;
            res.send(output)
        } catch (error) {
            //出错处理
            console.log("get user info error:",error)
            await t.rollback();
            output.success = statusCode.SERVICE_STATUS.GET_USERINFO_FAIL.success
            output.status = statusCode.SERVICE_STATUS.GET_USERINFO_FAIL.status
            output.description = statusCode.SERVICE_STATUS.GET_USERINFO_FAIL.description
            res.send(output)
        }
    }
})

/**
 * 更新用户信息
 */
router.post("/updateUserInfo",async (req,res)=>{
    let output={
        success:true,
        status:'',
        description:'',
        data:[]
    }
    console.log("start update user info,req.body:",req.body);

    //{nickname,sex,birthday}
    let toUpdateInfo = req.body;
    //目标状态
    let userInfo = req.userInfo;

    const t = await sqldb.sequelize.transaction();

    try {
        
        let curDate = new Date().toLocaleString()

        const matchedUserCount = await sqldb.User.count(
            {
                where:{
                    nickname:toUpdateInfo.nickname,
                    sex:toUpdateInfo.sex,
                    birthday:toUpdateInfo.birthday,
                    id:userInfo.id,
                    status:1
                },
            }
        )
        if(matchedUserCount >=1)
        {
            logger.info("update user info,same data, not update");
        }
        else{
            const affectedNum = await sqldb.User.update(
                {
                    nickname:toUpdateInfo.nickname,
                    sex:toUpdateInfo.sex,
                    birthday:toUpdateInfo.birthday
                },
                {
                    where:{
                        id:userInfo.id,
                        status:1
                    },
                    transaction: t
                }
            );
    
            console.log("updateResult:",affectedNum)
            if(affectedNum[0] !== 1)
            {
                throw "更新用户信息失败"
            }
            //记录日志
            {
                //记录事件
                const affectedNum = await sqldb.UserLog.create(
                    {
                        desc:statusCode.EVENT_LIST.UPDATE_USER_INFO.desc,
                        time:curDate,
                        event:statusCode.EVENT_LIST.UPDATE_USER_INFO.code,
                        u_id:userInfo.id
                    },
                    {
                        //指定新增哪些字段
                        fields:['desc','time','event','u_id'],
                        transaction: t
                    }
                );
                console.log("affectedNum:",affectedNum);
            }
            await t.commit();
        }
        console.log("更新用户信息成功！")
        //再次查询用户信息
        const userBasicInfo = await sqldb.User.findOne(
            {
                attributes: ['id','email',['nickname','nickName'],['head_pic','headPic'],'level','time','sex','birthday'],
                where: {
                    id:userInfo.id,
                    status:1
                }
            }
        );
        output.success = statusCode.SERVICE_STATUS.UPDATE_USER_INFO_SUCCESS.success
        output.status = statusCode.SERVICE_STATUS.UPDATE_USER_INFO_SUCCESS.status
        output.description = statusCode.SERVICE_STATUS.UPDATE_USER_INFO_SUCCESS.description
        output.data = userBasicInfo;
        res.send(output);
        return;
    } catch (error) {
        //出错处理
        console.log(error)

        t.rollback();

        output.success = statusCode.SERVICE_STATUS.UPDATE_USER_INFO_FAIL.success
        output.status = statusCode.SERVICE_STATUS.UPDATE_USER_INFO_FAIL.status
        output.description = statusCode.SERVICE_STATUS.UPDATE_USER_INFO_FAIL.description

        res.send(output);
    }

    console.log("End of update user info")
    return
})

/**
 * 更新用户头像
 */
router.post("/uploadHeadPic",async (req,res)=>{
    let output={
        success:true,
        status:'',
        description:'',
        data:[]
    }
    console.log("start upload head pic");

    let files = req.files;
    let userInfo = req.userInfo;
    let curDate = new Date().toLocaleString();

    if(!files)
    {
        output.success = statusCode.SERVICE_STATUS.PARAM_ERROR.success
        output.status = statusCode.SERVICE_STATUS.PARAM_ERROR.status
        output.description = statusCode.SERVICE_STATUS.PARAM_ERROR.description
        console.log("upload head pic,no files upload:",files);
    }
    else{
        const t = await sqldb.sequelize.transaction();
        
        try {
            let file = files.avatar;
            console.log("file Info:",file);
            let fileName = file.name;
            let fileSuffixNameArr = fileName.split('.');
            let fileSuffixName = fileSuffixNameArr[fileSuffixNameArr.length - 1];
            
            //上传到哪个文件夹下
            let fileStorePath = path.join(path.dirname(__dirname),'public','imgs/avatar');
            console.log("fileStorePath:",fileStorePath);

            //存储在网络上的文件名 时间戳+后缀
            let storageFileName = 'avatar' + '-' + userInfo.id + "."+ fileSuffixName;
            console.log('storageFileName:',storageFileName);

            //判断存储路径是否存在 如果不存在则创建文件夹
            checkDirectory(fileStorePath);

            //上传文件 将文件保存到指定目录下
            file.mv(fileStorePath+'/'+storageFileName,err =>{
                if(err)
                {
                    //上传失败错误处理
                    console.log("upload fail:",err);
                }
                else
                {
                    console.log("file move success");
                }
            })
            
            //生成图片的虚拟地址 http://localhost:80/image/avatar/avatar-[id].jpg
            let imageURL = req.protocol + '://' + req.get('host') + '/imgs/avatar/' +storageFileName;
            console.log('imageURL',imageURL);

            //先查询是否有同样的数据，如果有则不再更新
            const matchedUserCount = await sqldb.User.count(
                {
                    where:{
                        head_pic:imageURL,
                        id:userInfo.id,
                        status:1
                    },
                }
            );
            logger.info(`match user count=> ${matchedUserCount}`);
            if(matchedUserCount == 0)
            {
                const affectedNum = await sqldb.User.update(
                    {
                        head_pic:imageURL
                    },
                    {
                        where:{
                            id:userInfo.id,
                            status:1
                        },
                        transaction: t
                    }
                );
                if(affectedNum[0] !== 1)
                {
                    logger.info(`affectedNum[0]=>${affectedNum[0]}`);
                    throw "更新用户头像信息失败"
                }
            }
            

            //记录日志
            //记录用户登录日志
            const addLog = await sqldb.UserLog.create(
                {
                    desc:statusCode.EVENT_LIST.UPDATE_USER_AVATAR.desc,
                    time:curDate,
                    event:statusCode.EVENT_LIST.UPDATE_USER_AVATAR.code,
                    u_id:userInfo.id
                },
                {
                    //指定新增哪些字段
                    fields:['desc','time','event','u_id'],
                    transaction: t
                }
            );
            
            console.log("Add log:",addLog);
            await t.commit();

            output.success = statusCode.SERVICE_STATUS.UPDATE_USER_AVATAR_SUCCESS.success
            output.status = statusCode.SERVICE_STATUS.UPDATE_USER_AVATAR_SUCCESS.status
            output.description = statusCode.SERVICE_STATUS.UPDATE_USER_AVATAR_SUCCESS.description

            console.log("Update user avatar success");

        } catch (error) {
            //出错处理
            console.log("Update user avatar fail:",error);

            t.rollback();

            output.success = statusCode.SERVICE_STATUS.UPDATE_USER_AVATAR_FAIL.success
            output.status = statusCode.SERVICE_STATUS.UPDATE_USER_AVATAR_FAIL.status
            output.description = statusCode.SERVICE_STATUS.UPDATE_USER_AVATAR_FAIL.description
        }

        console.log("End of upload head pic")
    }
    res.send(output);

    return
})

module.exports=router;