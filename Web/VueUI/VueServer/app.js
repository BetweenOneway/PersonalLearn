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
            res.send({code:1,msg:"登录成功"});
        }
    })
});