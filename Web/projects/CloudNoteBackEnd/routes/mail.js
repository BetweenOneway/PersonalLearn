const express=require("express");
var router=express.Router();

var nodemailer = require("nodemailer");
const config = require('config')

var smtp = config.get("appSettings.smtp");
var mailFrom = config.get("appSettings.mailFrom");
var mailPwd = config.get("appSettings.mailPwd");

//email,subject,text,html
function emailTo(mailInfo={},resultInfo={}) {
    var transporter = nodemailer.createTransport({
        host: smtp,
        auth: {
            user: mailFrom,
            pass: mailPwd //授权码,通过QQ获取
        }
    });
    var mailOptions = {
        from: mailFrom, // 发送者
        to: mailInfo.email, // 接受者,可以同时发送多个,以逗号隔开
        subject: mailInfo.subject, // 标题
    };
    if(mailInfo.text != undefined)
    {
        mailOptions.text =mailInfo.text;// 文本
    }
    else if(html != undefined)
    {
        mailOptions.html =mailInfo.html;// html
    }

    resultInfo.statusCode = 200
    resultInfo.message = '发送成功!'

    try {
        transporter.sendMail(mailOptions, function (err, info) {
            if (err) {
                resultInfo.statusCode = 500;
                resultInfo.message = err;
                return;
            }
        });
    } catch (err) {
        resultInfo.statusCode = 500;
        resultInfo.message = err;
    }
}