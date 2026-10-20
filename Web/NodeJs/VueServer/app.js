const express = require('express');
const bodyParser = require('body-parser');
const cors=require("cors");
const jwt = require('jsonwebtoken'); // 用于处理 JSON Web Tokens
var createError = require('http-errors'); // 用于创建 HTTP 错误
//var path = require('path'); // 用于处理文件和目录路径

var app = express();
var server = app.listen(18081);//这里监听的是请求的端口
app.use(cors({
  origin:["http://localhost:18080","http://127.0.0.1:18080","http://127.0.0.1:8080","http://localhost:8080"],//这里的端口是指网页端口，并非请求端口
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
//这是另外一个测试项 如果测试cookie，需要将它注释掉
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
        jwt.verify(refreshToken, 'VUESERVER'); // 验证 refreshToken
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
        const user = jwt.verify(accessToken, 'VUESERVER'); // 验证 accessToken
        res.locals.user = user; // 将用户信息存储在 res.locals 中，供后续中间件使用
        return next(); // 验证成功，调用 next() 继续处理请求
    } catch (error) {
        return res.status(401).send({ message: 'Unauthorized' }); // 如果验证失败，返回 401 Unauthorized
    }
})

app.use(express.json()); // 解析 JSON 格式的请求体
app.use(express.urlencoded({ extended: false })); // 解析 URL 编码的请求体

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

// ===== HttpOnly / SameSite / Secure 演示 =====
// 一次性种下各种属性的 cookie，供前端对比“服务端收到”与“JS 能读到”的差异
app.get('/cookie-demo/set', (req, res) => {
    // 普通 cookie：前端 JS 可读（document.cookie 能看到）
    res.cookie('demo-readable', 'js-can-read', { maxAge: 900000 });
    // HttpOnly：JS 读不到，但会随请求自动发送给服务端
    res.cookie('demo-http-only', 'secret-from-server', { maxAge: 900000, httpOnly: true });
    // SameSite=Strict：只有“同站”请求（当前页直接发起）才携带，跨站链接/重定向不会带
    res.cookie('demo-samesite-strict', 'strict', { maxAge: 900000, sameSite: 'strict' });
    // SameSite=Lax（默认值）：安全的跨站 GET 请求会携带，是最常用的宽松策略
    res.cookie('demo-samesite-lax', 'lax', { maxAge: 900000, sameSite: 'lax' });
    // SameSite=None：跨站也发送，但“必须”配合 Secure，且跨域时需带 credentials
    res.cookie('demo-samesite-none', 'none', { maxAge: 900000, sameSite: 'none', secure: true });
    // Secure：原则上仅在 HTTPS 下才保存/发送；
    // 但注意：localhost / 127.0.0.1 被浏览器视为“安全上下文”，即使是明文 HTTP 也例外 ——
    // 所以本机(localhost)HTTP 下这个 cookie 仍会被保存和携带。若想看到 Secure 被拦截，
    // 需用非 loopback 主机(如 http://192.168.x.x)访问，或把后端升级为 HTTPS。
    res.cookie('demo-secure', 'only-https', { maxAge: 900000, secure: true });

    res.send('demo cookies set. 打开 Application 面板查看各属性，再点 readDemoCookies 比对');
});

// 返回服务端实际收到的 cookie 字符串
app.get('/cookie-demo/read', (req, res) => {
    console.log(' cookie-demo/read req cookie=>', req.headers.cookie);
    res.send(`server received cookie=>${req.headers.cookie}`);
});

// ===== Cookie path 属性演示 =====
// path 决定“哪些请求路径才会携带该 cookie”。
// 注意：示例用 http://localhost:18081，cookie 会落在 localhost 域（与 127.0.0.1 域互不干扰）。
app.get('/path-demo/set', (req, res) => {
    // path:'/' —— 该域下所有请求都携带
    res.cookie('path-root', 'any-path', { maxAge: 900000, path: '/' });
    // path:'/path-demo/foo' —— 只有请求 /path-demo/foo 及其子路径才携带
    res.cookie('path-foo', 'only-foo', { maxAge: 900000, path: '/path-demo/foo' });
    // path:'/path-demo/bar' —— 只有请求 /path-demo/bar 及其子路径才携带
    res.cookie('path-bar', 'only-bar', { maxAge: 900000, path: '/path-demo/bar' });

    res.send('path cookies set. 再点 readPathFoo / readPathBar 对比携带情况');
});

app.get('/path-demo/foo', (req, res) => {
    console.log(' path-demo/foo req cookie=>', req.headers.cookie);
    res.send(`foo received cookie=>${req.headers.cookie}`);
});

app.get('/path-demo/bar', (req, res) => {
    console.log(' path-demo/bar req cookie=>', req.headers.cookie);
    res.send(`bar received cookie=>${req.headers.cookie}`);
});

const login=require("./routes/login");

app.use(function(req,res,next){
    console.log(`req-0:${req.method} ${req.url}`);
    next();
});

app.use("/login",function(req,res,next){
    console.log(`userLogin-0:${req.method} ${req.url}`);
    next();
});

//用户相关
app.use("/login",login);

// 捕获 404 错误并转发到错误处理器
app.use(function (req, res, next) {
    next(createError(404)); // 创建 404 错误
});