const express=require("express");

var router=express.Router();

router.post("/*",function (req, res, next) {
        console.log("===========new request========")
        console.log("url:",req.url);
        console.log("method:",req.method);
        console.log("params:",req.params);
        console.log("query:",req.query);
        console.log("data:",req.data);
        console.log("body",req.body);

        res.write("Hello world!");
        res.end()
        //仍然会打印
        console.log("after end")
        return
  }
)

module.exports=router;