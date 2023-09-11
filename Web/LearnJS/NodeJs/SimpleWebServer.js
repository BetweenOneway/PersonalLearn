const http = require('http');
var app = http.createServer();
app.listen(8080);
app.on('request',function(req,res){
    console.log(req.url);
    console.log(req.method);
    //console.log(req);
});