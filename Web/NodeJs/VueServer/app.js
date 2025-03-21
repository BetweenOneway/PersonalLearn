const express = require('express');
const bodyParser = require('body-parser');
const cors=require("cors");

var app = express();
var server = app.listen(18081);//这里监听的是请求的端口
app.use(cors({
  origin:["http://localhost:8080","http://127.0.0.1:8080"],//这里的端口是指网页端口，并非请求端口
  //origin: ["http://127.0.0.1:8080"],
  credentials: true,
}));//从此所有响应，自动带Access-Control-Allow-Origin:http://127.0.0.1:5500
//万一客户端浏览器地址发生变化，只改这里origin一处即可！

//使用body-parser中间件
app.use(bodyParser.urlencoded({extended:false}));

const cookieExpires = () => {
    const d = new Date() // 获取当前时间
    d.setTime(d.getTime() + (24 * 60 * 60 * 1000))
    return d.toGMTString()
}

app.get('/rwCookie-NotSetHeader', (req, res) => {
    const cookieStr = req.headers.cookie // 获取 cookie
    console.log(` rwCookie-NotSetHeader req cookie=>${cookieStr}`) // 在控制台输出 cookie

    res.setHeader('Set-Cookie', `key-not-set-header-1=server-method1-250321; path=/rwCookie-NotSetHeader;expires=${cookieExpires()};`)
    res.send('Hello cookie method1!');
});

app.get('/rwCookie-SetHeader', (req, res) => {
    const cookieStr = req.headers.cookie // 获取 cookie
    console.log(` rwCookie-SetHeader req cookie=>${cookieStr}`) // 在控制台输出 cookie

    console.log("origin=>",req.headers.origin);
    res.setHeader("Access-Control-Allow-Origin", req.headers.origin);
    res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.setHeader("Access-Control-Allow-Credentials", "true");

    res.setHeader('Set-Cookie', `key-set-header-1=server-cookie-method2; path=/rwCookie-SetHeader;expires=${cookieExpires()};`)
    res.cookie('key-set-header-2', 'server-value2', { maxAge: 900000, httpOnly: false });
    res.send('Hello cookie method2!');
});