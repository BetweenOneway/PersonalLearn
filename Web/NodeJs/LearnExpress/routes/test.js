const express=require("express");

var router=express.Router();

router.get("/testMultiCallback",function (req, res, next) {
    console.log('the response will be sent by the next function ...')
    console.log("req.first_name",req.first_name);
    next()//必须调用，否则不会调用下一个回调
  }, function (req, res) {
    console.log('Hello from B!');
    console.log("req.last_name",req.last_name);
    res.send("Hello B!");
  }
)

module.exports=router;