//创建mysql连接池
const mysql = require('mysql');
var pool = mysql.createPool({
  host: '127.0.0.1',
  user: 'root',
  password: '',
  database: 'cloudnote',
  connectionLimit: 10,
  timezone:"08:00"
});
//把创建好的连接池导出
module.exports = pool;
