var express = require('express');
var router = express.Router();
let jwt = require('jsonwebtoken');
let { userModel } = require('../model/model');

const ACCESS_TOKEN_EXPIRATION = 5; //访问令牌有效期
const REFRESH_TOKEN_EXPIRATION = '1d'; //刷新令牌有效期
const SECRET_KEY = 'WANGJIALONG';
const refreshTokenMap = new Map();

// 生成函数令牌
function generateToken(name, expiration) {
    return jwt.sign({ name }, SECRET_KEY, { expiresIn: expiration });
}

// 封装生成短token和长token
function getToken(name) {
    let accessToken = generateToken(name, ACCESS_TOKEN_EXPIRATION); //短Token
    let refreshToken = generateToken(name, REFRESH_TOKEN_EXPIRATION); //长Token
    const refreshTokens = refreshTokenMap.get(name) || [];
    refreshTokens.push(refreshToken);
    refreshTokenMap.set(name, refreshTokens);
    return {
        accessToken,
        refreshToken,
    };
}

//=================================>账号密码登录
router.post('/userLogin', async (req, res) => {
    const { username, password } = req.body; // 直接解构请求体
    let user = await userModel.findOne({ username }); // 根据用户名查找用户
    if (!user) {
        return res.status(200).send({ message: '账号错误', code: 1 }); // 账号不存在
    }
    if (user.password !== password) { // 验证密码
        return res.status(200).send({ message: '密码错误', code: 2 });
    }
    let { accessToken, refreshToken } = getToken(user.username); // 使用用户名生成令牌
    res.status(200).send({
        data: user,
        accessToken,
        refreshToken,
        message: '登录成功',
        code: 200,
    });
});


// 刷新短token
router.get('/refresh', async (req, res) => {
    const refreshToken = req.headers.refreshtoken;
    if (!refreshToken) {
        res.status(403).send('Forbidden');
    }
    try {
        const { name } = jwt.verify(refreshToken, SECRET_KEY);
        const accessToken = generateToken(name, ACCESS_TOKEN_EXPIRATION);
        res.status(200).send({ accessToken });
    } catch (error) {
        console.log('长token已过期');
        res.status(403).send('Forbidden');
    }
});


router.post('/add', async (req, res) => {
    await userModel.create(req.body)
    res.send({
        code: 200
    })
})
module.exports = router;