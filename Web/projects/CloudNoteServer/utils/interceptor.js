let validate = require("./validate");

/*
* 请求中是否有user token参数，如果有则校验
* 校验成功则返回用户信息
*/
async function ValidateUserToken(req)
{
    console.log("req:",req);
    let userToken = req.get('userToken')
    if(!userToken)
    {
        //没有传递userToken参数 跳过校验
        console.log(userToken,'interceptor user token invalid......');
        return true;
    }
    //验证用户是否登录
    let validateInfo = await validate.IsUserValidate(userToken);
    if(!validateInfo.isValidated)
    {
        console.log("用户登录状态无效"+validateInfo.isValidated)
        return false;
    }
    //console.log("Interceptor userInfo:",validateInfo.userInfo);
    req.userInfo = validateInfo.userInfo;
    return true
}

module.exports.Interceptor_ValidateUserToken = ValidateUserToken;