const express=require("express");
const path = require('path')
const fs = require('fs');
//const stringRandom = require("string-random");
//let redisOper =require("../utils/redisOper")

//数据库
var sqldb = require('../sqldb');

//邮箱操作
var mailOper =require("../utils/mail")
//状态码定义
var statusCode = require("./statusCode")

let validate = require("../utils/validate")

var router=express.Router();

//判断目录是否存在，不存在则创建
function checkDirectory(dirPath) {
    fs.access(dirPath,async(err)=>{
        if(err)
        {
            await fs.mkdir(dirPath, { recursive: true });
        }
    })
}

//图片上传
router.post("/upload/pic",async(req,res)=>{
    console.log("uploadPic start,req.body:",req.body);

    //定义返回结构
    var output={
        success:false,
        status:'',
        description:'',
        data:{}
    }

    try{
        //验证用户是否登陆
        let userToken = req.body.userToken
        let validateInfo = await validate.IsUserValidate(userToken);
        
        if(!validateInfo.isValidated)
        {
            output.success = statusCode.SERVICE_STATUS.NOT_LOGIN.success
            output.status = statusCode.SERVICE_STATUS.NOT_LOGIN.status
            output.description = statusCode.SERVICE_STATUS.NOT_LOGIN.description
            res.send(output)
            return
        }
        let userInfo = validateInfo.userInfo;

        //An array of files will be stored in req.files
        if(!req.files) {
            console.log("no files uploaded");
            output.success = statusCode.SERVICE_STATUS.NOT_LOGIN.success
            output.status = statusCode.SERVICE_STATUS.NOT_LOGIN.status
            output.description = statusCode.SERVICE_STATUS.NOT_LOGIN.description
            res.send(output);
            return
        } 
        
        var files = req.files;
        for (var key in files) {
            let file = files[key];

            //上传到哪个文件夹下 分用户存储
            let fileStorePath = path.join(path.dirname(__dirname),'public','imgs',userInfo.id);

            //存储在网络上的文件名 时间戳+后缀
            let storageFileName = 'pic' + '-' + Date.now() + file.suffixName;
            console.log('storageFileName:',storageFileName);

            //判断存储路径是否存在 如果不存在则创建文件夹
            checkDirectory(fileStorePath);

            //上传文件 将文件保存到指定目录下
            file.mv(fileStorePath+'/'+storageFileName,err =>{
                //上传失败错误处理
                console.log("upload fail");
            })
            
            //生成图片的虚拟地址 http://localhost:80/image/8081.jpg
            let imageURL = req.protocol + '://' + req.get('host') + '/imgs' +'/'+ userInfo.id +'/'+storageFileName;
            console.log('imageURL',imageURL);

            output.data.imageURL = imageURL;
        }
    }catch (error) {
        console.log("catch error:",error)
        //出错处理
        res.send(output)
        return
    }

    output.success = true;
    res.send(output)
})

module.exports=router;