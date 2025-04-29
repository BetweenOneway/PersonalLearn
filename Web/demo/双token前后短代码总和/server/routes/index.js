const router = require('koa-router')()
const jwt = require('jsonwebtoken')
const { getAccesstoken, getRefershtoken, secret } = require('../utils/token')
// 登录接口
router.get('/login', (ctx) => {
  let code, msg, data = null
  code = 200
  msg = '登录成功，获取到token'
  data = {
    accessToken: getAccesstoken(),
    refershToken: getRefershtoken()
  }
  ctx.body = {
    code,
    msg,
    data
  }

})
// 获取数据接口
router.get('/getList', (ctx) => {
  let code, msg, data = null
  code = 200
  msg = '请求数据成功'
  ctx.body = {
    code,
    msg,
    data
  }

})
// 验证长token是否有效
router.get('/refresh', (ctx) => {
  let code, msg, data = null
  // 解析请求头中携带的长token
  let token = ctx.request.headers['pass']
  jwt.verify(token, secret, (error) => {

    if (error) {
      code = 4004
      msg = '长token无效，请重新登录'
      ctx.body = {
        code,
        msg,
        data
      }

    } else {

      let accessToken = getAccesstoken()
      code = 2002
      msg = '长token有效，请求到新的token'
      data = {
        accessToken
      }
      ctx.body = {
        code,
        msg,
        data
      }

    }

  })



})
module.exports = router
