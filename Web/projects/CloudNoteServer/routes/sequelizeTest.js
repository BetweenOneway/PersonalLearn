const express=require("express");

var router=express.Router();

var sqldb = require('../sqldb');

router.get('/getAll',async (req,res)=>{
    //select * from user;
    const users = await sqldb.User.findAll();
    console.log(users.every(user => user instanceof sqldb.User)); // true
    console.log("All users:", JSON.stringify(users, null, 2));
    res.send(users)
})

module.exports=router;