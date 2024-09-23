let validate = require("./validate");

/*
* 请求中是否有user token参数，如果有则校验
* 校验成功则返回用户信息
*/
async function ValidateUserToken(req,outputInfo)
{
    let userToken = req.get('userToken')
    if(!userToken)
    {
        return true;
    }
    //验证用户是否登录
    let validateInfo = await validate.IsUserValidate(userToken);
    if(!validateInfo.isValidated)
    {
        console.log("用户登录状态无效"+validateInfo.isValidated)
        output.success = statusCode.SERVICE_STATUS.NOT_LOGIN.success
        output.status = statusCode.SERVICE_STATUS.NOT_LOGIN.status
        output.description = statusCode.SERVICE_STATUS.NOT_LOGIN.description
        return false
    }
    outputInfo = validateInfo.userInfo
    console.log("parsed userinfo:",outputInfo);
    return true;
}

module.exports.Interceptor_ValidateUserToken = ValidateUserToken;