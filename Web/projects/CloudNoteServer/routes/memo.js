const express=require("express");
const crypto = require("crypto")
const redis = require('redis')
const stringRandom = require("string-random");

var pool = require("../pool");
var mailOper =require("./mail");

var router=express.Router();

module.exports=router;