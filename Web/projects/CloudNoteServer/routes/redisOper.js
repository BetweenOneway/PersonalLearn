const redis = require('redis');
const redisClient = redis.createClient('6379', '127.0.0.1')

function redisGet(key) {
    // (async function(){
    //     await redisClient.connect()
    //     redisClient.on('error', err => {
    //         console.error(err) // 打印监听到的错误信息
    //     })
    //     redisClient.get(key, (err, result) => {
    //       if (err) {
    //         reject(err);
    //       } else {
    //         resolve(result);
    //       }
    //     });
    // })();
    return new Promise(async(resolve, reject) =>  {
        await redisClient.connect()
        redisClient.on('error', err => {
            console.error(err) // 打印监听到的错误信息
        })
        redisClient.get(key, (err, result) => {
            if (err) {
                reject(err);
            } else {
                resolve(result);
            }
        });
    });
}

module.exports.RedisGet = redisGet
