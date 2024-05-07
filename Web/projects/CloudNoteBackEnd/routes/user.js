const express=require("express");
var router=express.Router();

router.get("/login",(req,res)=>{
    console.log(req.query);

    res.writeHead(200,{
        "Access-Control-Allow-Origin":"*",//可伪装成任意网址
        //内容类型      普通文本
        "Content-Type":"text/plain;charset=utf-8"//避免乱码
    })
    res.write("Hello world!");
    res.end();
})
module.exports=router;