const redis = require('redis');
const redisClient = redis.createClient('6379', '127.0.0.1')

async function redisConnect()
{
    await redisClient.connect()
    redisClient.on(error,err=>{
        console.log(err)
    })
}
async function redisGet(key) {
    return new Promise(async(resolve, reject) => {
        await redisConnect()
        redisClient.get(key).then((err,result)=>{
            if (err) {
                console.log("redis get error")
                throw err
                reject(err)
            } else {
                console.log("get %o",value)
                resolve(result)
            }
        })
    })
}

module.exports.RedisGet = redisGet
