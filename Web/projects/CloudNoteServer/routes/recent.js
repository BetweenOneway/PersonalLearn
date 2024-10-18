const express=require("express");
const { Op } = require("sequelize");

//数据库
var sqldb = require('../sqldb');

let statusCode = require("./statusCode")

var router=express.Router();

/**
 * 获取指定用户最近访问的文件
 */
router.get("/getRecentAccessFiles",async (req,res)=>{})

module.exports=router;