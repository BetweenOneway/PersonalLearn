const process = require('node:process');

const redis = require('redis');

const REDIS_HOST = process.env.REDIS_HOST || '127.0.0.1';
const REDIS_PORT = process.env.REDIS_PORT || '6379';
const COMMAND_TIMEOUT = 5000; // 单条命令超时 5 秒

class RedisOper {
    constructor(){
        console.log(`[Redis] Initializing client, host=${REDIS_HOST}:${REDIS_PORT}`);
        this.redisClient = redis.createClient(
            {
                socket: 
                {
                    host: REDIS_HOST,
                    port: REDIS_PORT,
                    connectTimeout: 10000,// TCP连接超时10s
                    family: 4,
                    reconnectStrategy: false // 禁用自动重连，由 ensureConnected 手动控制
                }
            }
        );
        
        // 配置redis的监听事件
        this.redisClient.on('ready', function() {
            console.log('Redis Client: ready')
        })
        
        // 连接到redis-server回调事件
        this.redisClient.on('connect', function () {
            console.log(new Date(), 'redis is now connected!');
        });
        
        this.redisClient.on('reconnecting', function () {
            //console.log(new Date(), 'redis reconnecting', arguments);
        });
        
        this.redisClient.on('end', function () {
            console.log('Redis Closed!');
        });
        
        this.redisClient.on('warning', function () {
            console.log('Redis client: warning', arguments);
        });
 
        this.redisClient.on('error', err => {
            //console.log('Redis Error ' + err);
        });

        // 初始化连接（异步）
        this._connectPromise = this.redisClient.connect().then(() => {
            console.log('[Redis] ✅ Connected successfully');
        }).catch(error => {
            console.log('[Redis] ❌ Connect FAILED:', error.message);
        });
    }

    // 确保连接已就绪（未连接则主动重连）
    async ensureConnected() {
        if (!this.redisClient.isOpen) {
            console.log('Redis not connected, reconnecting...');
            await this.redisClient.connect();
            console.log('Redis reconnected successfully');
        }
    }

    async connect() {
        await this._connectPromise;
    }

    quit() {
        this.redisClient.quit();
    }

    // 给 Redis 命令加超时保护（connectTimeout 只控制 TCP 握手，不控制命令执行）
    async withTimeout(promise, operation) {
        let timeoutId;
        const timeout = new Promise((_, reject) => {
            timeoutId = setTimeout(() => {
                reject(new Error(`Redis ${operation} timeout after ${COMMAND_TIMEOUT}ms`));
            }, COMMAND_TIMEOUT);
        });
        try {
            const result = await Promise.race([promise, timeout]);
            clearTimeout(timeoutId);
            return result;
        } catch (err) {
            clearTimeout(timeoutId);
            throw err;
        }
    }

    async RedisGet(key) {
        await this.ensureConnected();
        console.log("redis get,key:", key);
        return await this.withTimeout(this.redisClient.get(key), 'GET');
    }

    async RedisDel(key) {
        await this.ensureConnected();
        return await this.withTimeout(this.redisClient.del(key), 'DEL');
    }

    async RedisSet(key, value, expireSeconds) {
        await this.ensureConnected();
        return await this.withTimeout(
            this.redisClient.setEx(key, expireSeconds, value), 'SET'
        );
    }
}

module.exports = new RedisOper()
