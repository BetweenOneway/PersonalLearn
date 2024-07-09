const express=require("express");

var router=express.Router();

var sqldb = require('../sqldb');

//查询
router.get('/getAll',async (req,res)=>{
    //select * from user;
    const users = await sqldb.User.findAll();
    console.log(users.every(user => user instanceof sqldb.User)); // true
    console.log("All users:", JSON.stringify(users, null, 2));
    res.send(users)
})

//带条件查询
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

//新增 insert
router.get('/newAddUser',async (req,res)=>{
    console.log("Add user")
    const email = req.query.email;
    const nickName = req.query.nickname;
    const passWord = "e10adc3949ba59abbe56e057f20f883e"
    const level = 0;
    const curDate = new Date;
    const curDateFormated = curDate.toISOString().slice(0, 19).replace('T', ' ')
    const status = 1

    console.log(nickName)

    //select id,nickname from user where id = 35;
    const users = await sqldb.User.create(
        {
            email:email,
            password:passWord,
            nickname:nickName,
            level:level,
            time:curDateFormated,
            status:status
        },
        {
            //指定新增哪些字段
            fields:['email','password','nickname','level','time','status']
        }
    );
    console.log("Get users:", JSON.stringify(users));
    res.send("User:"+users.nickname+"，创建成功")
})

//删除用户
router.get('/delUser',async (req,res)=>{
    const email = req.query.email;
    const level = 0;
    const status = 1

    //select id,nickname from user where id = 35;
    const users = await sqldb.User.destroy(
        {
            where:{
                email:email,
                level:level,
                status:status
            }
        }
    );
    console.log("Get users:", JSON.stringify(users));
    res.send("User:"+users.nickname+"，删除成功")
})

//修改
router.get('/updateUser',async (req,res)=>{
    const userId = req.query.userId
    const email = req.query.email;
    const newNickName = req.query.newNickName;
    const curDate = new Date;
    const curDateFormated = curDate.toISOString().slice(0, 19).replace('T', ' ')

    console.log(curDate,curDateFormated)

    //select id,nickname from user where id = 35;
    const updateNum = await sqldb.User.update(
        {
            nickname:newNickName,
            time:curDateFormated
        },
        {
            where:{
                id:userId,
                email:email
            }
        }
    );

    console.log("Get users:", JSON.stringify(updateNum));
    res.send("User，修改成功")
})

//非托管事务
router.get('/unmanagedTransaction',async (req,res)=>{
    console.log("Add user with transaction")
    const email = req.query.email;
    const nickName = req.query.nickname;
    const passWord = "e10adc3949ba59abbe56e057f20f883e"
    const level = 0;
    const curDateFormated = new Date().toLocaleString();
    console.log("curDateFormated:",curDateFormated);
    const status = 1
    console.log("curDateFormated:",curDateFormated);
    // 首先, 我们从你的连接开始一个事务并将其保存到一个变量中
    const t = await sqldb.sequelize.transaction();

    try {
        // 然后,我们进行一些调用以将此事务作为参数传递:
        const user = await sqldb.User.create(
            {
                email:email,
                password:passWord,
                nickname:nickName,
                level:level,
                time:curDateFormated,
                status:status
            },
            {
                //指定新增哪些字段
                fields:['email','password','nickname','level','time','status'],
                transaction: t
            }
        );

        await sqldb.UserLog.create(
            {
                u_id: user.id,
                desc: '新增用户',
                time:curDateFormated,
                event:'用户注册'
            }, 
            { 
                transaction: t 
            }
        );

        // 如果执行到此行,且没有引发任何错误.
        // 我们提交事务.
        await t.commit();

    } catch (error) {
        console.log("新增用户出错：",error)
        // 如果执行到达此行,则抛出错误.
        // 我们回滚事务.
        await t.rollback();

    }
    res.send("transaction complete")
})
module.exports=router;