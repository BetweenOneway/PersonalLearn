const redis = require('redis');
const redisClient = redis.createClient({port:'6379', host:'127.0.0.1'})

async function redisConnect()
{
    try
    {
        await redisClient.connect()
        redisClient.on('error',err=>{
            console.log("redis connect error")
            console.log(err)
        })
    }
    catch(e)
    {
        console.log("redis connet error")
        console.log(e)
        throw(e)
    }
}

async function redisGet(key) {
    return new Promise(async(resolve, reject) => {
        await redisConnect()
        redisClient.get(key).then(val=>{
            resolve(val)
            redisClient.quit()
        })
    })
}

async function redisDel(key) {
    return new Promise(async(resolve, reject) => {
        await redisConnect()
        redisClient.del(key).then(val=>{
            resolve(val)
            redisClient.quit()
        })
    })
}

async function redisSet(key,value,expireSeconds) {
    return new Promise(async(resolve, reject) => {
        await redisConnect()
        try
        {
            redisClient.setEx(key,expireSeconds,value).then(val=>{
                resolve(val)
                redisClient.quit()
            })
        }
        catch(e)
        {
            console.log("set redis error:key:["+key+"],value:["+value+"]")
            reject()
        }
    })
}

module.exports = {
    RedisSet : redisSet,
    RedisGet : redisGet,
    RedisDel : redisDel
}
