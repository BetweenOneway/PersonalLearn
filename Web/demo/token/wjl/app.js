// 引入所需的模块
var createError = require('http-errors'); // 用于创建 HTTP 错误
var express = require('express'); // 引入 Express 框架
var path = require('path'); // 用于处理文件和目录路径
var cookieParser = require('cookie-parser'); // 用于解析 Cookie
var logger = require('morgan'); // 用于记录请求日志
const jwt = require('jsonwebtoken'); // 用于处理 JSON Web Tokens
const dotenv = require('dotenv'); // 用于加载环境变量
dotenv.config(); // 加载 .env 文件中的环境变量
const cors = require('cors'); // 用于处理跨域请求

// 引入路由模块
var indexRouter = require('./routes/index'); // 主路由
var usersRouter = require('./routes/users'); // 用户相关路由
var loginRouter = require('./routes/login'); // 登录相关路由

// 创建 Express 应用
var app = express();

// 使用 CORS 中间件，允许跨域请求
app.use(cors());

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

// 设置视图引擎
app.set('views', path.join(__dirname, 'views')); // 设置视图文件夹路径
app.set('view engine', 'ejs'); // 设置视图引擎为 EJS

// 使用中间件
app.use(logger('dev')); // 记录请求日志
app.use(express.json()); // 解析 JSON 格式的请求体
app.use(express.urlencoded({ extended: false })); // 解析 URL 编码的请求体
app.use(cookieParser()); // 解析 Cookie
app.use(express.static(path.join(__dirname, '/upload'))); // 设置静态文件目录

// 使用路由
app.use('/', indexRouter); // 主路由
app.use('/users', usersRouter); // 用户路由
app.use('/login', loginRouter); // 登录路由

// 捕获 404 错误并转发到错误处理器
app.use(function (req, res, next) {
    next(createError(404)); // 创建 404 错误
});

// 错误处理器
app.use(function (err, req, res, next) {
    // 设置 locals，仅在开发环境中提供错误信息
    res.locals.message = err.message; // 错误信息
    res.locals.error = req.app.get('env') === 'development' ? err : {}; // 在开发环境中提供完整错误信息

    // 渲染错误页面
    res.status(err.status || 500); // 设置响应状态
    res.render('error'); // 渲染错误页面
});

// 导出应用
module.exports = app; // 导出 Express 应用实例
