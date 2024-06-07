const redis = require('redis');
const redisClient = redis.createClient('6379', '127.0.0.1')

async function redisConnect()
{
    await redisClient.connect()
    redisClient.on('error',err=>{
        console.log(err)
    })
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
        redisClient.setEx(key,expireSeconds,value).then(val=>{
            resolve(val)
            redisClient.quit()
        })
    })
}

module.exports = {
    RedisSet : redisSet,
    RedisGet : redisGet,
    RedisDel : redisDel
}
