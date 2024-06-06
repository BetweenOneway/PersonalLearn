const redis = require('redis');
const redisClient = redis.createClient('6379', '127.0.0.1')

async function redisGet(key,value) {
    console.log("redis get:"+key)
    await redisClient.connect()
    redisClient.on('error', err => {
        console.error(err) // 打印监听到的错误信息
    })
    console.log("redis connected")
    return new Promise((resolve, reject) => {
        console.log("redis start get")
        redisClient.get(key).then(
            (err, result) => {
                if (err) {
                    console.log("redis get error")
                    throw err
                    reject(err)
                } else {
                    value = result
                    console.log("get %o",value)
                    resolve()
                }
            }
        );
    })
}

module.exports.RedisGet = redisGet
