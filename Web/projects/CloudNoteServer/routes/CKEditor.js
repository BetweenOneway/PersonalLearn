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

/**
 * app.post('/upload-avatar', async (req, res) => {
    try {
        if(!req.files) {
            res.send({
                status: false,
                message: 'No file uploaded'
            });
        } else {
            //Use the name of the input field (i.e. "avatar") to retrieve the uploaded file
            let avatar = req.files.avatar;
            
            //Use the mv() method to place the file in upload directory (i.e. "uploads")
            avatar.mv('./uploads/' + avatar.name);

            //send response
            res.send({
                status: true,
                message: 'File is uploaded',
                data: {
                    name: avatar.name,
                    mimetype: avatar.mimetype,
                    size: avatar.size
                }
            });
        }
    } catch (err) {
        res.status(500).send(err);
    }
});
 */
//图片上传
router.post("/upload/pic",async(req,res)=>{
    console.log("uploadPic start,req:",req.body);
    var userEmail = req.body.userEmail
    var userPassword = req.body.userPassword
    var output={
        success:false,
        status:'',
        description:'',
        userToken:'',
        userInfo:{}
    }

    {
        try {
            let originalFileName = ''
            //上传到哪个文件夹下
            let fileStorePath = '';
            //图片的虚拟地址 http://localhost:80/image/8081.jpg
            let imageURL = ''
            //获取文件后缀名
            let suffixName = '';
            //存储在网络上的文件名 时间戳+后缀
            let storageFileName = '';
            //判断存储路径是否存在 如果不存在则创建文件夹

            //上传文件 将文件保存到指定目录下
        } catch (error) {
            //出错处理
            res.send(output)
        }
    }
})