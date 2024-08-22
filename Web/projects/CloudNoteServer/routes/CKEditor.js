const express=require("express");
const crypto = require("crypto")
const path = require('path')
//const stringRandom = require("string-random");
//let redisOper =require("../utils/redisOper")

const multer = require('multer');

const storage = multer.diskStorage({
    destination:function (req, file, cb) {
        const targetDir = path.join(path.dirname(__dirname),'public','imgs');
        console.log("save to:",targetDir);
        cb(null, targetDir);
    },
    filename: function (req, file, cb) {
        console.log("file:",file);
        let targetFileName = file.fieldname + '-' + Date.now() + path.parse(file.originalname).ext;
        console.log("rename to:",targetFileName);
        cb(null, targetFileName);
    }
  }
)

var upload = multer({ storage: storage })

//数据库
var sqldb = require('../sqldb');

//邮箱操作
var mailOper =require("../utils/mail")
//状态码定义
var statusCode = require("./statusCode")
var router=express.Router();

//图片上传
router.post("/upload/pic",upload.any(),async(req,res)=>{
    console.log("uploadPic start");

    var output={
        success:false,
        status:'',
        description:'',
        userToken:'',
        userInfo:{}
    }
    //An array of files will be stored in req.files
    if(!req.files) {
        res.send({
            status: false,
            message: 'No file uploaded'
        });
    } else {
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
        output.success = true;
        res.send(output)
    }
})

module.exports=router;