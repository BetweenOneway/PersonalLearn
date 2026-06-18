/**
 * DevDockerCompositeDemo — Node.js 后端服务
 *
 * 架构：
 *   Vue 前端 → POST /api/login → Express → Redis (查缓存) → MySQL (写数据库)
 *
 * Redis 缓存逻辑：
 *   用户登录后，以 username 为 key 缓存 15 分钟（900 秒）
 *   15 分钟内同一用户再次登录，直接返回缓存结果，不写 MySQL
 */

const express = require("express");
const cors = require("cors");
const mysql = require("mysql2/promise");
const { createClient } = require("redis");

const app = express();
const PORT = process.env.PORT || 3000;

// ==================== 中间件 ====================
app.use(cors());
app.use(express.json());

// ==================== Redis 连接 ====================
const redisClient = createClient({
  url: `redis://${process.env.REDIS_HOST || "redis"}:${process.env.REDIS_PORT || 6379}`,
});

redisClient.on("error", (err) => console.error("Redis 连接错误:", err));
redisClient.on("connect", () => console.log("✅ Redis 已连接"));

// ==================== MySQL 连接池 ====================
const mysqlPool = mysql.createPool({
  host: process.env.MYSQL_HOST || "mysql",
  user: process.env.MYSQL_USER || "root",
  password: process.env.MYSQL_PASSWORD || "root123",
  database: process.env.MYSQL_DATABASE || "demo",
  waitForConnections: true,
  connectionLimit: 10,
});

// ==================== 业务逻辑 ====================

/**
 * 缓存 key 前缀
 */
const CACHE_PREFIX = "login:";

/**
 * 缓存过期时间（15 分钟）
 */
const CACHE_TTL = 15 * 60; // 900 秒

/**
 * POST /api/login
 *
 * 登录接口：
 *   1. 先查 Redis 缓存，若存在且未过期 → 直接返回（不写 MySQL）
 *   2. 缓存不存在或已过期 → 写入 MySQL，再写 Redis 缓存
 *
 * 请求体：{ username: string, password: string }
 */
/**
 * 查询用户的上次登录时间（排除最新的一条记录）
 */
async function getLastLoginTime(username) {
  const [rows] = await mysqlPool.query(
    "SELECT login_time FROM login_records WHERE username = ? ORDER BY login_time DESC LIMIT 1, 1",
    [username]
  );
  return rows.length > 0 ? rows[0].login_time : null;
}

app.post("/api/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    // 参数校验
    if (!username || !password) {
      return res.status(400).json({
        success: false,
        message: "用户名和密码不能为空",
      });
    }

    const cacheKey = CACHE_PREFIX + username;
    const loginTime = new Date();

    // ========== 第一步：查询上次登录时间（在写库之前查） ==========
    const lastLoginTime = await getLastLoginTime(username);

    // ========== 第二步：检查 Redis 缓存 ==========
    const cached = await redisClient.get(cacheKey);

    if (cached) {
      const cachedData = JSON.parse(cached);
      console.log(`[Redis 命中] 用户 ${username} 在 ${CACHE_TTL / 60} 分钟内已登录过，跳过数据库写入`);
      return res.json({
        success: true,
        message: `欢迎回来，${username}！`,
        data: {
          username: cachedData.username,
          loginTime: cachedData.loginTime,
          lastLoginTime: lastLoginTime ? lastLoginTime.toISOString() : loginTime.toISOString(),
          fromCache: true,
        },
      });
    }

    // ========== 第三步：缓存未命中，写入 MySQL ==========
    const connection = await mysqlPool.getConnection();

    try {
      await connection.execute(
        "INSERT INTO login_records (username, password, login_time) VALUES (?, ?, ?)",
        [username, password, loginTime]
      );

      // ========== 第四步：写入 Redis 缓存（15 分钟 TTL） ==========
      const cacheData = {
        username,
        loginTime: loginTime.toISOString(),
      };
      await redisClient.setEx(cacheKey, CACHE_TTL, JSON.stringify(cacheData));

      console.log(`[MySQL 写入] 用户 ${username} 登录成功，缓存 ${CACHE_TTL / 60} 分钟`);
      return res.json({
        success: true,
        message: `欢迎登录，${username}！`,
        data: {
          username,
          loginTime: loginTime.toISOString(),
          lastLoginTime: lastLoginTime ? lastLoginTime.toISOString() : loginTime.toISOString(),
          fromCache: false,
        },
      });
    } finally {
      connection.release();
    }
  } catch (err) {
    console.error("登录处理错误:", err);
    return res.status(500).json({
      success: false,
      message: "服务器内部错误",
    });
  }
});

/**
 * GET /api/health
 * 健康检查接口
 */
app.get("/api/health", async (req, res) => {
  let redisStatus = "disconnected";
  let mysqlStatus = "disconnected";

  try {
    await redisClient.ping();
    redisStatus = "connected";
  } catch (_) {}

  try {
    const conn = await mysqlPool.getConnection();
    await conn.ping();
    conn.release();
    mysqlStatus = "connected";
  } catch (_) {}

  res.json({
    status: "ok",
    redis: redisStatus,
    mysql: mysqlStatus,
    timestamp: new Date().toISOString(),
  });
});

/**
 * GET /api/login-records
 * 查询最近的登录记录（调试用）
 */
app.get("/api/login-records", async (req, res) => {
  try {
    const [rows] = await mysqlPool.query(
      "SELECT id, username, login_time FROM login_records ORDER BY login_time DESC LIMIT 20"
    );
    res.json({ success: true, records: rows });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ==================== 启动服务 ====================
async function start() {
  try {
    // 连接 Redis
    await redisClient.connect();

    // 测试 MySQL 连接
    const conn = await mysqlPool.getConnection();
    await conn.ping();
    conn.release();
    console.log("✅ MySQL 已连接");

    app.listen(PORT, () => {
      console.log("=".repeat(50));
      console.log(`🚀 后端服务已启动: http://localhost:${PORT}`);
      console.log(`   Redis:  ${process.env.REDIS_HOST || "redis"}:6379`);
      console.log(`   MySQL:  ${process.env.MYSQL_HOST || "mysql"}:3306`);
      console.log(`   缓存策略: ${CACHE_TTL / 60} 分钟内重复登录不写数据库`);
      console.log("=".repeat(50));
    });
  } catch (err) {
    console.error("启动失败:", err);
    process.exit(1);
  }
}

start();
