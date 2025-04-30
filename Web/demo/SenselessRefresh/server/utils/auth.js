const path = require('path')
const { secret } = require('./token')
const jwt = require('jsonwebtoken')

// 白名单
const whiteList = ['/login', '/refresh']
// 白名单判断
const isInWhiteList = (url, whiteList) => {

    return whiteList.find(item => item === url) ? true : false

}

// 函数中间件
const auth = async (ctx, next) => {
    let code, msg, data = null
    let url = ctx.path
    // 登录和验证长token 添加白名单
    if (isInWhiteList(url, whiteList)) {

        // 执行下一步
        return await next()

    } else {
        // 获取请求头上的token，判断是否过期
        let token = ctx.request.headers["authorization"]
        if (!token) {
            code = 4003
            msg = 'accessToken 是无效的'
            ctx.body = {
                code,
                msg,
                data
            }

        } else {
            // 验证token是否有效
            await jwt.verify(token, secret, async (error) => {

                // token无效
                if (error) {
                    code = 4003
                    msg = 'accessToken 是无效的'
                    ctx.body = {
                        code,
                        msg,
                        data
                    }

                } else {
                    // 有效 执行下一步
                    return await next()
                }

            })

        }

    }

}

module.exports = auth