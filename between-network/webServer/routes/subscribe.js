const express = require("express");
const { Op } = require("sequelize");

var sqldb = require('../sqldb');
let statusCode = require("./statusCode");
const logger = require("../utils/log");

var router = express.Router();

/**
 * 订阅/取消订阅（关注作者）切换
 * objectId 被关注作者编号
 * type 订阅类型【1：关注作者】
 */
router.post("/toggle", async (req, res) => {
    var output = {
        success: true,
        status: '',
        description: '',
        data: {}
    }

    logger.info('start toggle subscribe')

    try {
        let userInfo = req.userInfo;
        let objectId = req.body.objectId;
        let type = req.body.type || 1;

        if (!objectId) {
            output.success = statusCode.REDIS_STATUS.PARAM_ERROR.success;
            output.status = statusCode.REDIS_STATUS.PARAM_ERROR.status;
            output.description = statusCode.REDIS_STATUS.PARAM_ERROR.description;
            res.send(output);
            return;
        }

        // 不能关注自己
        if (objectId === userInfo.id) {
            output.success = statusCode.SERVICE_STATUS.SUB_FAIL.success;
            output.status = statusCode.SERVICE_STATUS.SUB_FAIL.status;
            output.description = '不能关注自己';
            res.send(output);
            return;
        }

        const t = await sqldb.sequelize.transaction();

        const existing = await sqldb.Subscribe.findOne({
            where: {
                u_id: userInfo.id,
                object_id: objectId,
                type: type
            },
            transaction: t
        });

        let curTime = new Date().toLocaleString();

        if (existing && existing.status === 1) {
            await sqldb.Subscribe.update(
                { status: 0 },
                { where: { id: existing.id }, transaction: t }
            );
            t.commit();
            output.success = statusCode.SERVICE_STATUS.UNSUB_SUCCESS.success;
            output.status = statusCode.SERVICE_STATUS.UNSUB_SUCCESS.status;
            output.description = statusCode.SERVICE_STATUS.UNSUB_SUCCESS.description;
            output.data.isSubscribed = false;
        } else if (existing && existing.status === 0) {
            await sqldb.Subscribe.update(
                { status: 1, time: curTime },
                { where: { id: existing.id }, transaction: t }
            );
            t.commit();
            output.success = statusCode.SERVICE_STATUS.SUB_SUCCESS.success;
            output.status = statusCode.SERVICE_STATUS.SUB_SUCCESS.status;
            output.description = statusCode.SERVICE_STATUS.SUB_SUCCESS.description;
            output.data.isSubscribed = true;
        } else {
            await sqldb.Subscribe.create(
                {
                    u_id: userInfo.id,
                    object_id: objectId,
                    type: type,
                    time: curTime,
                    status: 1
                },
                { transaction: t }
            );
            t.commit();
            output.success = statusCode.SERVICE_STATUS.SUB_SUCCESS.success;
            output.status = statusCode.SERVICE_STATUS.SUB_SUCCESS.status;
            output.description = statusCode.SERVICE_STATUS.SUB_SUCCESS.description;
            output.data.isSubscribed = true;
        }
    } catch (error) {
        console.log(error);
        output.success = statusCode.SERVICE_STATUS.SUB_FAIL.success;
        output.status = statusCode.SERVICE_STATUS.SUB_FAIL.status;
        output.description = statusCode.SERVICE_STATUS.SUB_FAIL.description;
    }

    logger.info('end toggle subscribe')

    res.send(output);
    return;
});

/**
 * 检查是否已订阅（关注）某作者
 * objectId 被关注作者编号
 * type 订阅类型
 */
router.get("/checkSubscribe", async (req, res) => {
    var output = {
        success: true,
        status: '',
        description: '',
        data: {}
    }

    try {
        let userInfo = req.userInfo;
        let objectId = req.query.objectId;
        let type = req.query.type || 1;

        logger.info(`start check subscribe=>${objectId}`)

        if (!objectId) {
            output.success = statusCode.REDIS_STATUS.PARAM_ERROR.success;
            output.status = statusCode.REDIS_STATUS.PARAM_ERROR.status;
            output.description = statusCode.REDIS_STATUS.PARAM_ERROR.description;
            res.send(output);
            return;
        }

        // 未登录时静默处理，前端默认未订阅
        if (!userInfo || !userInfo.id) {
            output.success = statusCode.SERVICE_STATUS.CHECK_SUB_SUCCESS.success;
            output.status = statusCode.SERVICE_STATUS.CHECK_SUB_SUCCESS.status;
            output.description = statusCode.SERVICE_STATUS.CHECK_SUB_SUCCESS.description;
            output.data.isSubscribed = false;
            res.send(output);
            return;
        }

        const record = await sqldb.Subscribe.findOne({
            where: {
                u_id: userInfo.id,
                object_id: objectId,
                type: type,
                status: 1
            }
        });

        output.success = statusCode.SERVICE_STATUS.CHECK_SUB_SUCCESS.success;
        output.status = statusCode.SERVICE_STATUS.CHECK_SUB_SUCCESS.status;
        output.description = statusCode.SERVICE_STATUS.CHECK_SUB_SUCCESS.description;
        output.data.isSubscribed = !!record;
    } catch (error) {
        console.log(error);
        output.success = statusCode.SERVICE_STATUS.CHECK_SUB_FAIL.success;
        output.status = statusCode.SERVICE_STATUS.CHECK_SUB_FAIL.status;
        output.description = statusCode.SERVICE_STATUS.CHECK_SUB_FAIL.description;
    }

    logger.info('end check subscribe')
    res.send(output);
    return;
});

/**
 * 获取某作者的订阅者（粉丝）数量
 * objectId 作者编号
 * type 订阅类型
 */
router.get("/getSubscribeCount", async (req, res) => {
    var output = {
        success: true,
        status: '',
        description: '',
        data: {}
    }

    try {
        let objectId = req.query.objectId;
        let type = req.query.type || 1;

        if (!objectId) {
            output.success = statusCode.REDIS_STATUS.PARAM_ERROR.success;
            output.status = statusCode.REDIS_STATUS.PARAM_ERROR.status;
            output.description = statusCode.REDIS_STATUS.PARAM_ERROR.description;
            res.send(output);
            return;
        }

        const count = await sqldb.Subscribe.count({
            where: {
                object_id: objectId,
                type: type,
                status: 1
            }
        });

        output.success = statusCode.SERVICE_STATUS.GET_SUB_COUNT_SUCCESS.success;
        output.status = statusCode.SERVICE_STATUS.GET_SUB_COUNT_SUCCESS.status;
        output.description = statusCode.SERVICE_STATUS.GET_SUB_COUNT_SUCCESS.description;
        output.data.subscribeCount = count;
    } catch (error) {
        console.log(error);
        output.success = statusCode.SERVICE_STATUS.GET_SUB_COUNT_FAIL.success;
        output.status = statusCode.SERVICE_STATUS.GET_SUB_COUNT_FAIL.status;
        output.description = statusCode.SERVICE_STATUS.GET_SUB_COUNT_FAIL.description;
    }

    res.send(output);
    return;
});

module.exports = router;
