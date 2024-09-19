const winston = require('winston')
const {Writable} = require('stream')
const stream = new Writable({
  objectMode: false,
  write: raw => console.log('stream msg', raw.toString())
})
// 创建http服务
// const http = require('http')
// http.createServer((req, res) => {
//     const arr = []
//     req
//       .on('data', chunk => arr.push(chunk))
//       .on('end', () => {
//         const msg = Buffer.concat(arr).toString()
//         console.log('http msg', msg)
//         res.end(msg)
//       })
//   })
//   .listen(8080)

/*
const levels = {
   error: 0,
   warn: 1,
   info: 2,
   http: 3,
   verbose: 4,
   debug: 5,
   silly: 6
 };
*/
//日志将显示在控制台输出中。
//只有属于错误级别的日志才会记录在 example.log 文件中
const logConfiguration = {
    transports: [
        new winston.transports.Console(
            {
                level: 'info',
            }
        ),
        new winston.transports.File({
            level: 'error',//只有当 info.level 小于或等于此级别时才记录
            // Create the log directory if it does not exist
            filename: 'logs/example.log'
        }),
        //new winston.transports.Http({host: 'localhost', port: 8080}),
        //new winston.transports.Stream({stream})
    ],
    format: winston.format.combine(
        winston.format.timestamp({
            format: 'MMM-DD-YYYY HH:mm:ss'
        }),
        winston.format.printf(info => `${info.level}: ${[info.timestamp]}: ${info.message}`),
    )
};

// 配置 4 种通道
const logger = winston.createLogger(logConfiguration)

module.exports = logger