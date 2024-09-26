let validate = require("./validate");

/*
* 请求中是否有user token参数，如果有则校验
* 校验成功则返回用户信息
*/
async function ValidateUserToken(req)
{
    let userToken = req.get('userToken')
    if(!userToken)
    {
        console.log(userToken,'interceptor user token invalid......');
        return null;
    }
    //验证用户是否登录
    let validateInfo = await validate.IsUserValidate(userToken);
    if(!validateInfo.isValidated)
    {
        console.log("用户登录状态无效"+validateInfo.isValidated)
        return null
    }
    console.log("Interceptor userInfo:",validateInfo.userInfo);
    return validateInfo.userInfo;
}

module.exports.Interceptor_ValidateUserToken = ValidateUserToken;