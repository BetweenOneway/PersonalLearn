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
router.post("/uploadPic",async(req,res)=>{
    console.log("uploadPic start,req.body:",req.body);

    //定义返回结构
    let output={
    }

    try{
        //req.files是一个对象，每一个文件的名称就是这个对象中的一个属性
        if(!req.files) {
            console.log("no files uploaded");
            output['error']="No files upload";
            res.send(output);
            return
        } 
        
        var files = req.files;
        for (var key in files) {
            let file = files[key];
            console.log("file Info:",file);
            let fileName = file.name;
            let fileSuffixNameArr = fileName.split('.');
            let fileSuffixName = fileSuffixNameArr[fileSuffixNameArr.length - 1];
            
            //上传到哪个文件夹下
            let fileStorePath = path.join(path.dirname(__dirname),'public','imgs');
            console.log("fileStorePath:",fileStorePath);

            //存储在网络上的文件名 时间戳+后缀
            let storageFileName = 'pic' + '-' + Date.now() + "."+ fileSuffixName;
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
            
            //生成图片的虚拟地址 http://localhost:80/image/8081.jpg
            let imageURL = req.protocol + '://' + req.get('host') + '/imgs' +'/'+storageFileName;
            console.log('imageURL',imageURL);

            output['url']=imageURL;
        }
    }catch (error) {
        console.log("upload pic error catched:",error);
        output['error']="Unexpected error happened";
        //出错处理
        res.send(output)
        return
    }
    res.send(output)
    return;
})

module.exports=router;