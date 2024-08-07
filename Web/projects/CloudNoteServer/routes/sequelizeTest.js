const express=require("express");

var router=express.Router();

var sqldb = require('../sqldb');
const { Op } = require("sequelize");

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

    //返回整个User对象 包含所有列
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

//排序
router.get('/order',async (req,res)=>{
    //select id,nickname from user order by id desc;
    //返回值是一个对象 findAll返回值是由多个对象组成的数组
    const users = await sqldb.User.findOne(
        {
            attributes: ['id', 'nickname'],
            order:[
                ['id', 'DESC']
            ]
        }
    );
    console.log("All users:", JSON.stringify(users, null, 2));
    res.send(users)
})

//组合条件查询 传什么条件组什么条件
router.get('/getComposedCondition',async (req,res)=>{
    console.log('get by composed condition',req.query)
    const {id,searchText,level} = req.query;
    console.log('parsed:',id,searchText,level);

    console.log('typeof(id)',typeof(id));//string
    console.log('typeof(email)',typeof(email));//string
    console.log('typeof(level)',typeof(level));//string

    let retrivedAttributes = [];
    let condition = {};

    retrivedAttributes.push('id');
    retrivedAttributes.push('email');
    retrivedAttributes.push('level');

    if(id != undefined && id != null && id.length != 0)
    {
        condition['id']=id;
    }
    
    if(searchText.length != 0 )
    {
        if(searchText != undefined && searchText != null && searchText.length != 0)
        {
            condition[Op.or]=[
                {
                    email: {
                    [Op.like]: `%${searchText}%`
                    }
                },
                {
                    nickname: {
                    [Op.like]: `%${searchText}%`
                    }
                }
            ]
        }
    }
    
    if(level != undefined && level != null && level.length != 0)
    {
        condition['level']=level;
    }
    
    const users = await sqldb.User.findAll({
        attributes: retrivedAttributes,
        where:condition
      });
    console.log("Get users by composed condition:", JSON.stringify(users));
    res.send(JSON.stringify(users))
})
module.exports=router;