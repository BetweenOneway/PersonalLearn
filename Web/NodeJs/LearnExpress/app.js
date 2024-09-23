const express = require('express');
const bodyParser = require('body-parser');
const cors=require("cors");

const test=require("./routes/test");

var app = express();
var server = app.listen(18081);//这里监听的是请求的端口
app.use(cors({
  origin:["http://localhost:8080","http://127.0.0.1:8080"]//这里的端口是指网页端口，并非请求端口
}));//从此所有响应，自动带Access-Control-Allow-Origin:http://127.0.0.1:5500
//万一客户端浏览器地址发生变化，只改这里origin一处即可！

//使用body-parser中间件
app.use(bodyParser.urlencoded({extended:false}));

//托管静态资源到public目录下
//app.use(express.static('public'));

//拦截要放在所有路由之前
app.all('*', (req, res, next) => {
    console.log('Accessing interceptor ...')
    req.first_name = "wang"
    req.last_name = "between"
    next() // pass control to the next handler
  }
)

//全局异常处理(无效)
// app.use(function(err, req, res, next) {
//     console.error("err happened:",err);
//     res.status(500).send('Something broke!');
//   }
// );

/*使用路由器来管理路由*/
app.use("/test",test);