//创建web服务器
//http内置模块 不需要下载
var app = require("http").createServer();
//创建socket.io对象
var io = require("socket.io")(app);
//绑定监听端口 注意端口占用情况
app.listen(3031);
//接收客户端请求
io.on("connection",(socket)=>{
    console.log("有客户端连接到服务器了");
    //服务端接收客户端消息
    //绑定事件 （事件自定义）
    socket.on("message",(data)=>{
        console.log("Recv from client:"+data);
        socket.emit("server","Hello client");
    })

    //发送广播消息
    io.emit("list","This is a broadcast!");

    //接收客户disconnect消息(默认事件 不可以改名)
    socket.on("disconnect",(data)=>{
        console.log("One client leave");
    });
});
