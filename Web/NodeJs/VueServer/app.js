const express = require('express');
const bodyParser = require('body-parser');
const cors=require("cors");
const jwt = require('jsonwebtoken'); // 用于处理 JSON Web Tokens

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

// 自定义中间件，用于处理 JWT 验证
app.use((req, res, next) => {
    // 定义不需要验证的路径
    let pathArr = [
        '/login/userLogin', // 用户登录路径
        '/login/refresh' // 刷新 token 的路径
    ]
    
    // 如果请求路径在不需要验证的路径中，直接调用 next() 继续处理
    if (pathArr.includes(req.path)) {
        return next()
    }

    // 获取请求头中的 accessToken 和 refreshToken
    const accessToken = req.headers.accesstoken; // 注意：这里的 'accesstoken' 虽然前端传过来是驼峰命名法'accessToken'
    const refreshToken = req.headers.refreshtoken; //但是这里也要全部小写，http的机制导致

    // 判断 refreshToken 是否过期
    try {
        jwt.verify(refreshToken, 'WANGJIALONG'); // 验证 refreshToken
    } catch (error) {
        console.log(error); // 打印错误信息
        return res.status(403).send({ message: 'Forbidden' }); // 如果验证失败，返回 403 Forbidden
    }

    // 如果没有 accessToken，返回 401 Unauthorized
    if (!accessToken) {
        return res.status(401).send({ message: 'Unauthorized' });
    }

    // 验证 accessToken
    try {
        const user = jwt.verify(accessToken, 'WANGJIALONG'); // 验证 accessToken
        res.locals.user = user; // 将用户信息存储在 res.locals 中，供后续中间件使用
        return next(); // 验证成功，调用 next() 继续处理请求
    } catch (error) {
        return res.status(401).send({ message: 'Unauthorized' }); // 如果验证失败，返回 401 Unauthorized
    }
})

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

const login=require("./routes/login");

//用户相关
app.use("/login",login);