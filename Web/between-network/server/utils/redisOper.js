const process = require('node:process');

const redis = require('redis');

class RedisOper {
    constructor(){
        this.redisClient = redis.createClient({port:'6379', host:'127.0.0.1',socket: {
            family: 4
        }});
        
        // 配置redis的监听事件
        this.redisClient.on('ready', function() {
            console.log('Redis Client: ready')
        })
        
        // 连接到redis-server回调事件
        this.redisClient.on('connect', function () {
            console.log(new Date(), 'redis is now connected!');
        });
        
        this.redisClient.on('reconnecting', function () {
            console.log(new Date(), 'redis reconnecting', arguments);
        });
        
        this.redisClient.on('end', function () {
            console.log('Redis Closed!');
        });
        
        this.redisClient.on('warning', function () {
            console.log('Redis client: warning', arguments);
        });
 
        this.redisClient.on('error', err => {
            console.log('Redis Error ' + err);
        });
        
        // 判断redis是否连接
        if (this.redisClient.isOpen) {
            console.log('rredis is now connected!')
        } else {
            this.redisClient.connect().catch(error => console.log(error));
        }
    }

    async contect() {
        await this.redisClient.connect().catch(error => console.log(error));
    }

    quit() {
        this.redisClient.quit();
    }

    async RedisGet(key) {
        return new Promise(async(resolve, reject) => {
            try {
                console.log("redis get,key:",key);
                this.redisClient.get(key).then((val,err)=>{
                    if(err)
                    {
                        reject(err);
                    }
                    else
                    {
                        resolve(val);
                    }
                })
            } catch (error) {
                console.log("redis Get error:",error);
            }
            
        })
    }

    async RedisDel(key) {
        return new Promise(async(resolve, reject) => {
            this.redisClient.del(key).then((val,err)=>{
                if(err)
                {
                    reject(err);
                }
                else
                {
                    resolve(val);
                }
            })
        })
    }

    async RedisSet(key,value,expireSeconds) {
        return new Promise(async(resolve, reject) => {
            try
            {
                this.redisClient.setEx(key,expireSeconds,value).then((val,err)=>{
                    if(err)
                    {
                        reject(err);
                    }
                    else
                    {
                        resolve(val);
                    }
                })
            }
            catch(e)
            {
                console.log("set redis error:key:["+key+"],value:["+value+"]")
                reject()
            }
        })
    }
}

module.exports = new RedisOper()
