//多对多聊天室服务器
//创建web服务器
//http内置模块 不需要下载
var app = require("http").createServer();
//创建socket.io对象
var io = require("socket.io")(app);
//绑定监听端口 注意端口占用情况
app.listen(3032);

var clientCount = 0;
//接收客户端请求
io.on("connection",(socket)=>{
    clientCount++;
    var nickname = "user:"+clientCount;
    //新人加入 广播给所有人
    io.emit("enter",nickname+",is coming.");

    //接收客户端的聊天消息 并广播
    socket.on("message",(data)=>{
        io.emit("list",nickname+":"+data);
    })

    //广播用户离开消息
    socket.on("disconnect",(data)=>{
        io.emit("leave",nickname+",leave...");
    })
});