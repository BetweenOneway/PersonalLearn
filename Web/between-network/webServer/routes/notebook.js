const express=require("express");
const crypto = require("crypto")
const redis = require('redis')
const { Op } = require("sequelize");

//数据库
var sqldb = require('../sqldb');

let statusCode = require("./statusCode")
let validate = require("../utils/validate");
const note = require("../models/note");

var router=express.Router();

/**
 * 获取用户笔记本列表
 * userToken 用户编号
 */
router.get("/getUserNotebookList",async (req,res)=>{
    var output={
        success:true,
        status:'',
        description:'',
        data:[]
    }

    console.log("start get user notebook list")
    
    var userToken = req.get('userToken')
    let userInfo = {}

    try {
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

        const notes = await sqldb.Notebook.findAll(
            {
                attributes: ['id', 'name','level','parent_id'],
                where:{
                    u_id:userInfo.id
                },
                order:[
                    ['level', 'ASC']
                ],
                raw:true,
            }
        );
        output.success = statusCode.SERVICE_STATUS.GET_NOTEBOOK_SUCCESS.success
        output.status = statusCode.SERVICE_STATUS.GET_NOTEBOOK_SUCCESS.status
        output.description = statusCode.SERVICE_STATUS.GET_NOTEBOOK_SUCCESS.description

        output.data = notes
        res.send(output);
    } catch (error) {
        console.log(error)
        output.success = statusCode.SERVICE_STATUS.GET_NOTEBOOK_FAIL.success
        output.status = statusCode.SERVICE_STATUS.GET_NOTEBOOK_FAIL.status
        output.description = statusCode.SERVICE_STATUS.GET_NOTEBOOK_FAIL.description
        res.send(output);
    }
    console.log("End of get user notebook list")
    return;
})