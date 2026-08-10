const express = require("express");
const { Op } = require("sequelize");
const { nextId } = require("../utils/snowflake");

var sqldb = require('../sqldb');
let statusCode = require("./statusCode");

var router = express.Router();

/**
 * 发表说说
 * content 说说内容
 * images  配图，逗号分隔（可选）
 */
router.post("/addMoment", async (req, res) => {
    var output = {
        success: true,
        status: '',
        description: '',
        data: {}
    }

    logger.info('start add moment')
    try {
        let userInfo = req.userInfo;
        let content = req.body.content;
        let images = req.body.images || null;

        if (!content || content.trim().length === 0) {
            output.success = statusCode.REDIS_STATUS.PARAM_ERROR.success;
            output.status = statusCode.REDIS_STATUS.PARAM_ERROR.status;
            output.description = statusCode.REDIS_STATUS.PARAM_ERROR.description;
            res.send(output);
            return;
        }

        const newMoment = await sqldb.Moment.create({
            id: nextId(),
            u_id: userInfo.id,
            content: content,
            images: images,
            time: new Date(),
            status: 1
        });

        output.success = statusCode.SERVICE_STATUS.ADD_MOMENT_SUCCESS.success;
        output.status = statusCode.SERVICE_STATUS.ADD_MOMENT_SUCCESS.status;
        output.description = statusCode.SERVICE_STATUS.ADD_MOMENT_SUCCESS.description;
        output.data.momentId = newMoment.id;
    } catch (error) {
        console.log(error);
        output.success = statusCode.SERVICE_STATUS.ADD_MOMENT_FAIL.success;
        output.status = statusCode.SERVICE_STATUS.ADD_MOMENT_FAIL.status;
        output.description = statusCode.SERVICE_STATUS.ADD_MOMENT_FAIL.description;
    }

    logger.info('end add moment')

    res.send(output);
    return;
});

/**
 * 获取说说列表
 * uId   用户编号
 * pageIndex 第几页
 * pageSize   每页几条
 */
router.get("/getMomentList", async (req, res) => {
    var output = {
        success: true,
        status: '',
        description: '',
        data: []
    }

    logger.info('start get moment list')

    try {
        let uId = req.query.uId;
        let pageIndex = parseInt(req.query.pageIndex) || 0;
        let pageSize = parseInt(req.query.pageSize) || 10;
        let offset = pageIndex * pageSize;

        if (!uId) {
            output.success = statusCode.REDIS_STATUS.PARAM_ERROR.success;
            output.status = statusCode.REDIS_STATUS.PARAM_ERROR.status;
            output.description = statusCode.REDIS_STATUS.PARAM_ERROR.description;
            res.send(output);
            return;
        }

        const { count, rows } = await sqldb.Moment.findAndCountAll({
            where: {
                u_id: uId,
                status: 1
            },
            include: [
                {
                    model: sqldb.User,
                    as: 'User',
                    attributes: ['id', 'nickname', 'head_pic']
                }
            ],
            order: [['time', 'DESC']],
            limit: pageSize,
            offset: offset
        });

        let momentList = [];
        for (let row of rows) {
            let item = {
                id: row.id,
                content: row.content,
                images: row.images,
                time: row.time,
                u_id: row.u_id,
                nickname: row.User ? row.User.nickname : '',
                head_pic: row.User ? row.User.head_pic : ''
            };
            momentList.push(item);
        }

        output.success = statusCode.SERVICE_STATUS.GET_MOMENT_LIST_SUCCESS.success;
        output.status = statusCode.SERVICE_STATUS.GET_MOMENT_LIST_SUCCESS.status;
        output.description = statusCode.SERVICE_STATUS.GET_MOMENT_LIST_SUCCESS.description;
        output.data = momentList;
        output.total = count;
        output.pageIndex = pageIndex;
        output.pageSize = pageSize;
    } catch (error) {
        console.log(error);
        output.success = statusCode.SERVICE_STATUS.GET_MOMENT_LIST_FAIL.success;
        output.status = statusCode.SERVICE_STATUS.GET_MOMENT_LIST_FAIL.status;
        output.description = statusCode.SERVICE_STATUS.GET_MOMENT_LIST_FAIL.description;
    }

    logger.info('end get moment list')

    res.send(output);
    return;
});

module.exports = router;
