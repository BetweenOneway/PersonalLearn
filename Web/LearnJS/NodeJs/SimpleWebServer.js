const http = require('http');
var app = http.createServer();
app.listen(8080);
app.on('request',function(req,res){
    console.log(req.url);
    console.log(req.method);
    //console.log(req);

    res.writeHead(200,{
        //"Access-Control-Allow-Origin":"http://127.0.0.1:5500",
        "Access-Control-Allow-Origin":"*",//可伪装成任意网址
        //内容类型      普通文本
        "Content-Type":"text/plain;charset=utf-8"//避免乱码
      })
      res.write("Hello world!");
      res.end();
});