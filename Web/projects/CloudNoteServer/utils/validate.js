let redisOper =require("../utils/redisOper")

async function IsUserValidate(userToken)
{
    let validateInfo = {
        isValidated:false,
        userInfo:{}
    }
    //验证用户是否登录
    try{
        if(!userToken)
        {
            return validateInfo;
        }
        let userTokenRedisValue = await redisOper.RedisGet(userToken)
        //console.log("retrived redis value:",userTokenRedisValue)
        if(userTokenRedisValue == null)
        {
            //用户未登录
            console.log("IsUserValidate:用户未登录")
            validateInfo.isValidated = false;
        }
        else
        {
            //console.log("IsUserValidate:用户状态有效")
            validateInfo.isValidated = true;
            validateInfo.userInfo = JSON.parse(userTokenRedisValue);
        }
    }
    catch(error)
    {
        validateInfo.isValidated = false
    }
    return validateInfo
}

module.exports.IsUserValidate = IsUserValidate