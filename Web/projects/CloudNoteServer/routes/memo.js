const express=require("express");
const crypto = require("crypto")
const redis = require('redis')
const stringRandom = require("string-random");

var pool = require("../utils/pool");
let statusCode = require("./statusCode")
let validate = require("../utils/validate")

var router=express.Router();

//获取用户所有正常的便签
router.get("/getUserMemoList",async (req,res)=>{
    var output={
        success:true,
        status:'',
        description:'',
        data:[]
    }
    console.log("start getMemoList");
    console.log(req.query)
    var userToken = req.query.userToken
    let status = 1
    let userInfo = {}

    //验证用户是否登录
    let validateInfo = await validate.IsUserValidate(userToken);
    if(!validateInfo.isValidated)
    {
        console.log("用户登录状态无效"+validateInfo.isValidated)
        output.success = statusCode.SERVICE_STATUS.NOT_LOGIN.success
        output.status = statusCode.SERVICE_STATUS.NOT_LOGIN.status
        output.description = statusCode.SERVICE_STATUS.NOT_LOGIN.description
        res.send(output)
        return
    }
    userInfo = validateInfo.userInfo
    console.log("parsed userinfo")
    console.log(userInfo)
    //查询当前用户的所有正常的便签
    //置顶在前 未完成在前 时间越近的越在前
    var sql = `SELECT id,title,top,tags,update_time,finished from z_thing WHERE u_id = ? AND status= ? ORDER BY top DESC,finished ASC,update_time DESC;`
    pool.getConnection(function(error,connection){
        connection.query(sql, [userInfo.id,status], function (error, results, fields) {
            if (error) {
                return connection.rollback(function() {
                    output.success = statusCode.DB_STATUS.SELECT_FAIL.success
                    output.status = statusCode.DB_STATUS.SELECT_FAIL.status
                    output.description = statusCode.DB_STATUS.SELECT_FAIL.description
                    res.send(output);
                    return
                });
            }
            console.log(results)
            output.success = statusCode.SERVICE_STATUS.GET_MEMO_SUCCESS.success
            output.status = statusCode.SERVICE_STATUS.GET_MEMO_SUCCESS.status
            output.description = statusCode.SERVICE_STATUS.GET_MEMO_SUCCESS.description
            output.data = results
            res.send(output);
            return
        })
    })
    
})

//置顶 取消置顶
router.get("/setMemoTop",async (req,res)=>{
    let output={
        success:true,
        status:'',
        description:'',
        data:[]
    }
    console.log("start set Top");
    console.log(req.query)
    
    //目标状态
    let targetTop = req.query.targetTop
    let memoId = req.query.memoId
    let userToken = req.query.userToken
    if(0 == userToken.length)
    {
        console.log("memo set top, userToken empty")
        output.success = statusCode.REDIS_STATUS.PARAM_ERROR.success
        output.status = statusCode.REDIS_STATUS.PARAM_ERROR.status
        output.description = statusCode.REDIS_STATUS.PARAM_ERROR.description
        res.send(output)
        return
    }

    //验证用户是否登陆
    let validateInfo = await validate.IsUserValidate(userToken);
    if(!validateInfo.isValidated)
    {
        output.success = statusCode.SERVICE_STATUS.NOT_LOGIN.success
        output.status = statusCode.SERVICE_STATUS.NOT_LOGIN.status
        output.description = statusCode.SERVICE_STATUS.NOT_LOGIN.description
        res.send(output)
        return
    }

    let userInfo = validateInfo.userInfo;
    let sql = `UPDATE z_thing SET \`top\` =? WHERE \`id\` = ? AND \`u_id\` = ? AND \`top\` != ? AND \`status\` = 1;`
    try{
        pool.getConnection(function(error,connection){
            connection.query(sql, [targetTop,memoId,userInfo.id,targetTop], function (error, results, fields) {
                if (error) {
                    return connection.rollback(function() {
                        output.success = statusCode.SERVICE_STATUS.MEMO_SET_TOP_FAIL.success
                        output.status = statusCode.SERVICE_STATUS.MEMO_SET_TOP_FAIL.status
                        output.description = statusCode.SERVICE_STATUS.MEMO_SET_TOP_FAIL.description
                        res.send(output);
                        return
                    });
                }
                console.log(results)
                if(results.affectedRows > 0)
                {
                    //记录事件日志
                    console.log("set memo top add event log")
                    var date = new Date();
                    let event = targetTop === 1? statusCode.EVENT_LIST.MEMO_SET_TOP : statusCode.EVENT_LIST.MEMO_UNSET_TOP;
                    console.log('time:'+date.toISOString().slice(0, 19).replace('T', ' '))
                    console.log(event)
                    sql = `INSERT INTO z_note_thing_log(\`time\`,\`event\`,\`desc\`,\`u_id\`,\`t_id\`) VALUES(?,?,?,?,?)`
                    connection.query(sql, [date.toISOString().slice(0, 19).replace('T', ' ')
                        ,event.code,event.desc,userInfo.id,memoId], 
                        function (error, results, fields){
                            console.log(results)
                            if (error || results.affectedRows <= 0) {
                                return connection.rollback(function() {
                                    console.log("memo置顶 日志记录失败")
                                    output.success = statusCode.SERVICE_STATUS.MEMO_SET_TOP_FAIL.success
                                    output.status = statusCode.SERVICE_STATUS.MEMO_SET_TOP_FAIL.status
                                    output.description = statusCode.SERVICE_STATUS.MEMO_SET_TOP_FAIL.description
                                    res.send(output);
                                    return
                                });
                            }
                            connection.commit(function(err) {
                                if (err) {
                                    return connection.rollback(function() {
                                        //提交错误处理
                                        console.log("set memo top,commit database error")
                                        output.success = statusCode.SERVICE_STATUS.MEMO_SET_TOP_FAIL.success
                                        output.status = statusCode.SERVICE_STATUS.MEMO_SET_TOP_FAIL.status
                                        output.description = statusCode.SERVICE_STATUS.MEMO_SET_TOP_FAIL.description
                                        res.send(output);
                                    });
                                }
                                else{
                                    console.log("set memo top,commit database success")
                                    output.success = statusCode.SERVICE_STATUS.MEMO_SET_TOP_SUCCESS.success
                                    output.status = statusCode.SERVICE_STATUS.MEMO_SET_TOP_SUCCESS.status
                                    output.description = statusCode.SERVICE_STATUS.MEMO_SET_TOP_SUCCESS.description
                                    res.send(output);
                                }
                            })
                    })
                    
                }
                else
                {
                    console.log("set memo top, affected rows < 0")
                    return connection.rollback(function() {
                        output.success = statusCode.SERVICE_STATUS.MEMO_SET_TOP_FAIL.success
                        output.status = statusCode.SERVICE_STATUS.MEMO_SET_TOP_FAIL.status
                        output.description = statusCode.SERVICE_STATUS.MEMO_SET_TOP_FAIL.description
                        res.send(output);
                        return
                    });
                }
            })
        })
    }
    catch(e){
        console.log(e)
        output.success = statusCode.SERVICE_STATUS.COMMON_EXCEPTION.success
        output.status = statusCode.SERVICE_STATUS.COMMON_EXCEPTION.status
        output.description = statusCode.SERVICE_STATUS.COMMON_EXCEPTION.description
        res.send(output);
    }
    return
})

//删除便签
router.delete("/deleteMemo",async (req,res)=>{
    let output={
        success:true,
        status:'',
        description:'',
        data:[]
    }
    console.log("start del memo");
    console.log("req.query")
    console.log(req.query)
    //目标状态
    let isCompleteDel = req.query.isCompleteDel.toLowerCase() === 'true'
    let memoId = req.query.memoId
    let userToken = req.query.userToken
    if(0 == userToken.length)
    {
        console.log("del memo, userToken empty")
        output.success = statusCode.REDIS_STATUS.PARAM_ERROR.success
        output.status = statusCode.REDIS_STATUS.PARAM_ERROR.status
        output.description = statusCode.REDIS_STATUS.PARAM_ERROR.description
        res.send(output)
        return
    }

    //验证用户是否登陆
    let validateInfo = await validate.IsUserValidate(userToken);
    if(!validateInfo.isValidated)
    {
        output.success = statusCode.SERVICE_STATUS.NOT_LOGIN.success
        output.status = statusCode.SERVICE_STATUS.NOT_LOGIN.status
        output.description = statusCode.SERVICE_STATUS.NOT_LOGIN.description
        res.send(output)
        return
    }

    let userInfo = validateInfo.userInfo;
    var date = new Date();
    let curTime = date.toISOString().slice(0, 19).replace('T', ' ')
    let sql;
    if(isCompleteDel)
    {
        sql = `UPDATE z_thing SET status = -1 ,update_time=? WHERE \`id\` = ? AND \`u_id\` = ? AND \`status\` != -1;`
    }
    else{
        sql = `UPDATE z_thing SET status = 0 ,update_time=? WHERE \`id\` = ? AND \`u_id\` = ? AND \`status\` = 1;`
    }

    try{
        pool.getConnection(function(error,connection){
            connection.query(sql, [curTime,memoId,userInfo.id], function (error, results, fields) {
                if (error) {
                    return connection.rollback(function() {
                        output.success = statusCode.SERVICE_STATUS.DEL_MEMO_FAIL.success
                        output.status = statusCode.SERVICE_STATUS.DEL_MEMO_FAIL.status
                        output.description = statusCode.SERVICE_STATUS.DEL_MEMO_FAIL.description
                        res.send(output);
                        return
                    });
                }
                console.log(results)
                if(results.affectedRows > 0)
                {
                    //记录事件日志
                    console.log("del memo add event log")
                    
                    let event = isCompleteDel? statusCode.EVENT_LIST.MEMO_COMPEL_DEL : statusCode.EVENT_LIST.MEMO_DEL;
                    console.log('time:'+curTime)
                    console.log(event)
                    sql = `INSERT INTO z_note_thing_log(\`time\`,\`event\`,\`desc\`,\`u_id\`,\`t_id\`) VALUES(?,?,?,?,?)`
                    connection.query(sql, [curTime
                        ,event.code,event.desc,userInfo.id,memoId], 
                        function (error, results, fields){
                            console.log(results)
                            if (error || results.affectedRows <= 0) {
                                return connection.rollback(function() {
                                    console.log("del memo add event log fail")
                                    output.success = statusCode.SERVICE_STATUS.DEL_MEMO_FAIL.success
                                    output.status = statusCode.SERVICE_STATUS.DEL_MEMO_FAIL.status
                                    output.description = statusCode.SERVICE_STATUS.DEL_MEMO_FAIL.description
                                    res.send(output);
                                    return
                                });
                            }
                            connection.commit(function(err) {
                                if (err) {
                                    return connection.rollback(function() {
                                        //提交错误处理
                                        console.log("del memo,commit database error")
                                        output.success = statusCode.SERVICE_STATUS.DEL_MEMO_FAIL.success
                                        output.status = statusCode.SERVICE_STATUS.DEL_MEMO_FAIL.status
                                        output.description = statusCode.SERVICE_STATUS.DEL_MEMO_FAIL.description
                                        res.send(output);
                                    });
                                }
                                else{
                                    console.log("del memo success,commit database success")
                                    output.success = statusCode.SERVICE_STATUS.DEL_MEMO_SUCCESS.success
                                    output.status = statusCode.SERVICE_STATUS.DEL_MEMO_SUCCESS.status
                                    output.description = statusCode.SERVICE_STATUS.DEL_MEMO_SUCCESS.description
                                    res.send(output);
                                }
                            })
                    })
                    
                }
                else
                {
                    console.log("del memo, affected rows < 0")
                    return connection.rollback(function() {
                        output.success = statusCode.SERVICE_STATUS.DEL_MEMO_FAIL.success
                        output.status = statusCode.SERVICE_STATUS.DEL_MEMO_FAIL.status
                        output.description = statusCode.SERVICE_STATUS.DEL_MEMO_FAIL.description
                        res.send(output);
                        return
                    });
                }
            })
        })
    }
    catch(e){
        console.log(e)
        output.success = statusCode.SERVICE_STATUS.COMMON_EXCEPTION.success
        output.status = statusCode.SERVICE_STATUS.COMMON_EXCEPTION.status
        output.description = statusCode.SERVICE_STATUS.COMMON_EXCEPTION.description
        res.send(output);
    }
    return
})

module.exports=router;