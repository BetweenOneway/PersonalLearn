const express = require('express');
const bodyParser = require('body-parser');
const cors=require("cors");
const fileUpload = require('express-fileupload');

//拦截器
const interceptor = require('./utils/interceptor');

/*引入路由模块*/
const user=require("./routes/user");
const memo=require("./routes/memo");
const note=require("./routes/note");
const dumpster=require("./routes/dumpster");
const recent=require("./routes/recent")
const fileOper=require("./routes/fileOper")
const CKEditor=require("./routes/CKEditor");
const notebook = require('./routes/notebook');

const sequelizeTest = require("./routes/sequelizeTest")

let statusCode = require("./routes/statusCode")

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
// parse application/json
app.use(bodyParser.json())
app.use(bodyParser.raw());
app.use(bodyParser.text());

// 配置文件上传模块
app.use(fileUpload());

//托管静态资源到public目录下
app.use(express.static('public'));

//拦截要放在所有路由之前
app.all('*', async (req, res, next) => {
    console.log('Accessing interceptor ...')
    let validateSuccess = await interceptor.Interceptor_ValidateUserToken(req);
    if(!validateSuccess)
    {
        console.log("用户信息验证失败");
        let output={
            success:true,
            status:'',
            description:'',
            data:{}
        }
        output.success = statusCode.SERVICE_STATUS.ACCOUNT_PASSWORD_NOT_MATCHED.success
        output.status = statusCode.SERVICE_STATUS.ACCOUNT_PASSWORD_NOT_MATCHED.status
        output.description = statusCode.SERVICE_STATUS.ACCOUNT_PASSWORD_NOT_MATCHED.description
        res.send(output)
    }
    else{
        next() // pass control to the next handler
    }
  }
)
  
/*使用路由器来管理路由*/
//用户相关
app.use("/user",user);
//便签
app.use("/memo",memo);
//笔记
app.use("/note",note);
//笔记本
app.use('/notebook',notebook);
//CKEditor编辑器
app.use("/ckeditor",CKEditor)
//回收站操作
app.use("/dumpster",dumpster);
//最近操作
app.use("/recently",recent);
//文件操作
app.use("/file",fileOper);

//测试用
app.use("/sequelize",sequelizeTest)