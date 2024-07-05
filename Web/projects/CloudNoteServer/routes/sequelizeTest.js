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

router.get('/getWithCondition',async (req,res)=>{
    const userId = req.query.id;
    //select id,nickname from user where id = 35;
    const users = await sqldb.User.findAll({
        attributes: ['id', 'nickname'],
        where: {
            id: userId
        }
      });
    console.log("Get users:", JSON.stringify(users));
    res.send(JSON.stringify(users))
})

module.exports=router;