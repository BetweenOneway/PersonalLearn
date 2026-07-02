//创建mysql连接池
const mysql = require('mysql');
var pool = mysql.createPool({
  host: process.env.MYSQL_HOST || '127.0.0.1',
  user: process.env.DB_USER || 'cloudnote',
  password: process.env.DB_PASSWORD || 'cloudnote123',
  database: process.env.MYSQL_DATABASE || 'cloudnote',
  connectionLimit: 10,
  timezone:"08:00"
});
//把创建好的连接池导出
module.exports = pool;
