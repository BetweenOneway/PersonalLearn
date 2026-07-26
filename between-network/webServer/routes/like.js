const express = require("express");
const { Op } = require("sequelize");

var sqldb = require('../sqldb');
let statusCode = require("./statusCode");

var router = express.Router();

/**
 * 点赞/取消点赞 切换
 * objectId 对象编号
 * type 对象类型【1：笔记，2：便签】
 */
router.post("/toggle", async (req, res) => {
    var output = {
        success: true,
        status: '',
        description: '',
        data: {}
    }

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

        const t = await sqldb.sequelize.transaction();

        const existing = await sqldb.Like.findOne({
            where: {
                u_id: userInfo.id,
                object_id: objectId,
                type: type
            },
            transaction: t
        });

        let curTime = new Date().toLocaleString();

        if (existing && existing.status === 1) {
            await sqldb.Like.update(
                { status: 0 },
                { where: { id: existing.id }, transaction: t }
            );
            t.commit();
            output.success = statusCode.SERVICE_STATUS.UNLIKE_SUCCESS.success;
            output.status = statusCode.SERVICE_STATUS.UNLIKE_SUCCESS.status;
            output.description = statusCode.SERVICE_STATUS.UNLIKE_SUCCESS.description;
            output.data.isLiked = false;
        } else if (existing && existing.status === 0) {
            await sqldb.Like.update(
                { status: 1, time: curTime },
                { where: { id: existing.id }, transaction: t }
            );
            t.commit();
            output.success = statusCode.SERVICE_STATUS.LIKE_SUCCESS.success;
            output.status = statusCode.SERVICE_STATUS.LIKE_SUCCESS.status;
            output.description = statusCode.SERVICE_STATUS.LIKE_SUCCESS.description;
            output.data.isLiked = true;
        } else {
            await sqldb.Like.create(
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
            output.success = statusCode.SERVICE_STATUS.LIKE_SUCCESS.success;
            output.status = statusCode.SERVICE_STATUS.LIKE_SUCCESS.status;
            output.description = statusCode.SERVICE_STATUS.LIKE_SUCCESS.description;
            output.data.isLiked = true;
        }
    } catch (error) {
        console.log(error);
        output.success = statusCode.SERVICE_STATUS.LIKE_FAIL.success;
        output.status = statusCode.SERVICE_STATUS.LIKE_FAIL.status;
        output.description = statusCode.SERVICE_STATUS.LIKE_FAIL.description;
    }
    res.send(output);
    return;
});

/**
 * 检查是否已点赞
 * objectId 对象编号
 * type 对象类型
 */
router.get("/checkLike", async (req, res) => {
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

        if (!objectId) {
            output.success = statusCode.REDIS_STATUS.PARAM_ERROR.success;
            output.status = statusCode.REDIS_STATUS.PARAM_ERROR.status;
            output.description = statusCode.REDIS_STATUS.PARAM_ERROR.description;
            res.send(output);
            return;
        }

        const record = await sqldb.Like.findOne({
            where: {
                u_id: userInfo.id,
                object_id: objectId,
                type: type,
                status: 1
            }
        });

        output.success = statusCode.SERVICE_STATUS.CHECK_LIKE_SUCCESS.success;
        output.status = statusCode.SERVICE_STATUS.CHECK_LIKE_SUCCESS.status;
        output.description = statusCode.SERVICE_STATUS.CHECK_LIKE_SUCCESS.description;
        output.data.isLiked = !!record;
    } catch (error) {
        console.log(error);
        output.success = statusCode.SERVICE_STATUS.CHECK_LIKE_FAIL.success;
        output.status = statusCode.SERVICE_STATUS.CHECK_LIKE_FAIL.status;
        output.description = statusCode.SERVICE_STATUS.CHECK_LIKE_FAIL.description;
    }
    res.send(output);
    return;
});

/**
 * 获取点赞数
 * objectId 对象编号
 * type 对象类型
 */
router.get("/getLikeCount", async (req, res) => {
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

        const count = await sqldb.Like.count({
            where: {
                object_id: objectId,
                type: type,
                status: 1
            }
        });

        output.success = statusCode.SERVICE_STATUS.GET_LIKE_COUNT_SUCCESS.success;
        output.status = statusCode.SERVICE_STATUS.GET_LIKE_COUNT_SUCCESS.status;
        output.description = statusCode.SERVICE_STATUS.GET_LIKE_COUNT_SUCCESS.description;
        output.data.likeCount = count;
    } catch (error) {
        console.log(error);
        output.success = statusCode.SERVICE_STATUS.GET_LIKE_COUNT_FAIL.success;
        output.status = statusCode.SERVICE_STATUS.GET_LIKE_COUNT_FAIL.status;
        output.description = statusCode.SERVICE_STATUS.GET_LIKE_COUNT_FAIL.description;
    }
    res.send(output);
    return;
});

module.exports = router;