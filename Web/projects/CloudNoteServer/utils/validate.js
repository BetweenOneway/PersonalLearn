let redisOper =require("../utils/redisOper")

async function IsUserValidate(userToken)
{
    let validateInfo = {
        isValidated:false,
        userInfo:{}
    }
    //验证用户是否登录
    try{
        userTokenRedisValue = await redisOper.RedisGet(userToken)
        console.log("retrived redis value:")
        console.log(userTokenRedisValue)
        if(userTokenRedisValue == null)
        {
            //用户未登录
            validateInfo.isValidated = false;
        }
        else
        {
            validateInfo.isValidated = true;
            validateInfo.userInfo = JSON.parse(userTokenRedisValue);
        }
    }
    catch(error)
    {
        userValidate = false
    }
    return userValidate
}

module.exports = IsUserValidate