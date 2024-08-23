const express = require('express');
const bodyParser = require('body-parser');
const cors=require("cors");

/*引入路由模块*/
const sequelizeTest = require("./routes/sequelizeTest")
const user=require("./routes/user");
const memo=require("./routes/memo");
const note=require("./routes/note");
const CKEditor=require("./routes/CKEditor");

//启动数据库
var sqldb = require('./sqldb');
sqldb.sequelize.sync({force: false}).then(function() {
    console.log("Server successed to start");
    // let rawAttrs = sqldb.Note.rawAttributes;
    // console.log("note:",rawAttrs);
    // rawAttrs = sqldb.User.rawAttributes;
    // console.log("user:",rawAttrs);
}).catch(function(err){
    console.log("Server failed to start due to error: %s", err);
});

/*
请求路径 http://127.0.0.1:5050/user/login?lid=30&pname=dell
*/

var app = express();
var server = app.listen(18081);//这里监听的是请求的端口
app.use(cors({
  origin:["http://localhost:8080","http://127.0.0.1:8080"]//这里的端口是指网页端口，并非请求端口
}));//从此所有响应，自动带Access-Control-Allow-Origin:http://127.0.0.1:5500
//万一客户端浏览器地址发生变化，只改这里origin一处即可！

//使用body-parser中间件
app.use(bodyParser.urlencoded({extended:false}));

//托管静态资源到public目录下
app.use(express.static('public'));

/*使用路由器来管理路由*/
//用户相关
app.use("/user",user);
//便签
app.use("/memo",memo);
//笔记
app.use("/note",note);
//
app.use("/ckeditor",CKEditor)
//测试用
app.use("/sequelize",sequelizeTest)
