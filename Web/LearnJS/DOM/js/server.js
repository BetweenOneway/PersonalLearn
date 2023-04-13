const http=require("http");
const url=require("url");

http.createServer((req,res)=>{
    var type = url.parse(req.url,true).query.type;
    res.writeHead(200,{"Access-Control-Allow-Origin":"*"});
    if(type=="a")
    {
        res.write(JSON.stringify({type:"a",count:30}));
    }
    else if(type=="b")
    {
        res.write(JSON.stringify({type:"b",count:20}));
    }
    else if(type=="c")
    {
        res.write(JSON.stringify({type:"c",count:40}));
    }
    setTimeout(()=>{res.end();},3000);
}).listen(5050);