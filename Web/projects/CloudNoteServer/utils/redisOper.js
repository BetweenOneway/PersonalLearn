const redis = require('redis');
const redisClient = redis.createClient({port:'6379', host:'127.0.0.1',socket: {
    family: 4
  }})

// 将Redis连接实例作为全局变量
//global.redisClient = redisClient;

// 监听beforeExit事件
process.on('beforeExit', () => {
    console.log("before exit");
    // 关闭Redis连接
    redisClient.quit();
  }
);

// 错误处理
// redisClient.on('error', (error) => {
//     // 输出错误信息
//     console.error('Redis Error:', error);

//     // 自动重连
//     redisClient.quit();
//     redisClient.connect();
// });

async function redisConnect()
{
    try
    {
        // Check if the socket is already opened
        if (!redisClient.isOpen) {
            await redisClient.connect()
        }
        
        redisClient.on('error',err=>{
            console.log("redis connect error:",err)
        })
    }
    catch(e)
    {
        console.log("redis connet error:",e)
        throw(e)
    }
}

async function redisGet(key) {
    return new Promise(async(resolve, reject) => {
        try {
            await redisConnect()
            redisClient.get(key).then(val=>{
                resolve(val)
                redisClient.quit()
            })
        } catch (error) {
            console.log("redis Get error:",error);
        }
        
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
