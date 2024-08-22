const express=require("express");

var router=express.Router();

router.get("/testMultiCallback",function (req, res, next) {
    console.log('the response will be sent by the next function ...')
    next()//必须调用，否则不会调用下一个回调
  }, function (req, res) {
    console.log('Hello from B!');
    res.send('Hello from B!')
  }
)

module.exports=router;