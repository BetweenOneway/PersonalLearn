//引入第三方模块
const express = require("express");
const session = require("express-session");
const cors = require("cors");
const mysql = require("mysql");

//创建连接池
var pool = mysql.createPool({
    host:"127.0.0.1",
    user:"root",
    password:"",
    port:3306,
    database: 'xz',
    connectionLimit:20
});

//创建web服务器 监听8080端口
var server = express();
server.listen(8080);

//配置跨域
server.use(cors({
    origin:["http://127.0.0.1:5050","http://localhost:5050"],
    credentials:true
}))

//配置session session的配置要在所有请求之前
server.use(session({
    secret:"128位的字符串",
    resave:true,
    saveUninitialized:true
}));

//配置静态目录
//http://127.0.0.1:8080/01.jpg
server.use(express.static("public"));

//http:127.0.0.1:8080/login?uname=tom&upwd=123
server.get("/login",(req,res)=>{
    var u = req.query.uname;
    var p = req.query.upwd;

    var sql = "select id from xz_login ";
    sql += "where uname = ? and upwd=md5(?)";

    pool.query(sql,[u,p],(err,result)=>{
        if(err) throw err;
        if(result.length==0)
        {
            res.send({code:-1,msg:"用户名或密码有误"});
        }
        else{
            //获取当前登录用户ID
            var id = result[0].id;
            //保存当前用户ID到session中 为什么是保存在req中呢？
            req.session.uid = id;
            res.send({code:1,msg:"登录成功"});
        }
    })
});

//商品分页显示
server.get("/product",(req,res)=>{
    var pno = req.query.pno;
    var pagesize = req.query.pagesize;
    if(!pno)
    {
        pno = 1;
    }
    if(!pagesize)
    {
        pagesize=4;
    }

    var sql = "select lid,lname,price,img_url from xz_laptop ";
    sql += "limit ?,?";

    var offset = (pno-1)*pagesize;//起始记录数
    pagesize = parseInt(pagesize);//行数

    pool.query(sql,[offset,pagesize],(err,result)=>{
        if(err)
        {
            throw err;
        }
        res.send({code:1,msg:"查询成功",data:result});
    });
});