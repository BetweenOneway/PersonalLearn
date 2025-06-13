const express = require('express');
const fs = require('fs');
const path = require('path');

// 创建服务器
const app = express();

// 允许跨域
app.all('*', function (req, res, next) {
  res.header('Access-Control-Allow-Origin', req.headers.origin);
  // res.header("Access-Control-Allow-Origin", '*');
  res.header(
    'Access-Control-Allow-Headers',
    'Content-Type,Content-Length, Authorization, Accept,X-Requested-With',
  );
  res.header('Access-Control-Allow-Methods', 'PUT,POST,GET,DELETE,OPTIONS');
  res.header('Access-Control-Allow-Credentials', 'true');
  res.header('X-Powered-By', ' 3.2.1');
  if (req.method === 'OPTIONS') res.send(200); /*让options请求快速返回*/
  else next();
});

// 成功的get请求
app.get('/ok', (req, res) => {
  res.json(200, {
    code: 0,
    message: 'ok',
    data: null,
  });
});
// 成功的get请求
app.post('/ok', (req, res) => {
  res.json(201, {
    code: 0,
    message: 'ok',
    data: null,
  });
});

// 服务器报错：403
app.get('/403', (req, res) => {
  res.json(403, {
    code: 1000,
    message: '鉴权失败',
    data: null,
  });
});
// 服务器报错：400
app.get('/400', (req, res) => {
  res.json(400, {
    code: 1001,
    message: '请求参数 xxx 必填',
    data: null,
  });
});
// 服务器报错：500
app.get('/500', (req, res) => {
  res.json(500, {
    code: 500,
    message: '服务器报错',
    data: null,
  });
});

// 服务器报错：逻辑错误
app.get('/codeError', (req, res) => {
  res.json(200, {
    code: 1002,
    message: '文章含有敏感词，请修改后再试错误',
    data: null,
  });
});

// 服务器返回文件流
app.get('/file', (req, res) => {
  const qrcodeName = 'Snipaste_2024-05-14_11-56-15.png';
  const filePath = path.resolve(__dirname, `./${qrcodeName}`);
  const cs = fs.readFileSync(filePath);
  res.status(200);
  res.end(cs);
});

// 开启监听
app.listen(8080, () => {
  console.log('服务器启动成功~');
});
