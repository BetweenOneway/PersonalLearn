const http = require('http');
const querystring = require('querystring');
var app = http.createServer();
app.listen(8080);

//设置跨域请求
// app.all('*', function (req, res, next) {
//     //设置请求头
//     //允许所有来源访问
//     res.header('Access-Control-Allow-Origin', '*')
//     //用于判断request来自ajax还是传统请求
//     res.header("Access-Control-Allow-Headers", " Origin, X-Requested-With, Content-Type, Accept");
//     //允许访问的方式
//     res.header('Access-Control-Allow-Methods', 'PUT,POST,GET,DELETE,OPTIONS')
//     //修改程序信息与版本
//     res.header('X-Powered-By', ' 3.2.1')
//     //内容类型：如果是post请求必须指定这个属性
//     res.header('Content-Type', 'application/json;charset=utf-8')
//     next()
//   })

app.on('request',function(req,res){
    // //设置请求头
    // //允许所有来源访问
    // res.header('Access-Control-Allow-Origin', '*')
    // //用于判断request来自ajax还是传统请求
    // res.header("Access-Control-Allow-Headers", " Origin, X-Requested-With, Content-Type, Accept");
    // //允许访问的方式
    // res.header('Access-Control-Allow-Methods', 'PUT,POST,GET,DELETE,OPTIONS')
    // //修改程序信息与版本
    // res.header('X-Powered-By', ' 3.2.1')
    // //内容类型：如果是post请求必须指定这个属性
    // res.header('Content-Type', 'application/json;charset=utf-8')

    console.log("===========new request========")
    console.log("url:",req.url);
    console.log("method:",req.method);

    // POST请求，意思是浏览器提交数据给服务器
    // 服务器肯定要接收这些数据，并把这些数据保存
    // 如何接收POST提交过来的数据
    /**
     * 1. 给req注册data事件，当有数据提交过来就会触发，事件的作用是接收数据，接收大量数据的时候，是分块接收的
     * 2. 给req注册end事件，当数据全部接收完毕，会触发
     */
    // 先定义一个空字符串，里面准备存放接收到的数据
    let str = '';
    req.on('data', (chunk) => {
        str += chunk; // 把接收到的一块数据拼接到str中
    });
    req.on('end', () => {
        console.log("end received:",str); // id=1&name=zs&age=43
        // 将接收到的数据，赋值给req.body
        // req.body属性本来不存在，是自定义的，你也可以用其他的名字
        req.body = querystring.parse(str); // querystring.parse是将字符串转成对象{id:1,bane:zs,age:43}

        console.log("params:",req.params);
        console.log("query:",req.query);
        console.log("data:",req.data);
        console.log("body",req.body);

        res.writeHead(200,{
            //"Access-Control-Allow-Origin":"http://127.0.0.1:5500",
            "Access-Control-Allow-Origin":"*",//可伪装成任意网址
            "Access-Control-Allow-Headers":" Origin, X-Requested-With, Content-Type, Accept",
            //内容类型      普通文本
            "Content-Type":"text/plain;charset=utf-8",//避免乱码
            //'Content-Type':'application/json;charset=utf-8',
            'Access-Control-Allow-Methods':'PUT,POST,GET,DELETE,OPTIONS'
        })
        res.write("Hello world!");
        res.end()
        //仍然会打印
        console.log("after end")
        return
        //不会打印
        console.log("after return")
    });
});