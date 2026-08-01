const express = require("express");
const { Op } = require("sequelize");

var sqldb = require('../sqldb');
let statusCode = require("./statusCode");

var router = express.Router();

/**
 * 收藏/取消收藏 切换
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

        const existing = await sqldb.Favorite.findOne({
            where: {
                u_id: userInfo.id,
                object_id: objectId,
                type: type
            },
            transaction: t
        });

        let curTime = new Date().toLocaleString();

        if (existing && existing.status === 1) {
            await sqldb.Favorite.update(
                { status: 0 },
                { where: { id: existing.id }, transaction: t }
            );
            t.commit();
            output.success = statusCode.SERVICE_STATUS.UNFAVORITE_SUCCESS.success;
            output.status = statusCode.SERVICE_STATUS.UNFAVORITE_SUCCESS.status;
            output.description = statusCode.SERVICE_STATUS.UNFAVORITE_SUCCESS.description;
            output.data.isFavorited = false;
        } else if (existing && existing.status === 0) {
            await sqldb.Favorite.update(
                { status: 1, time: curTime },
                { where: { id: existing.id }, transaction: t }
            );
            t.commit();
            output.success = statusCode.SERVICE_STATUS.FAVORITE_SUCCESS.success;
            output.status = statusCode.SERVICE_STATUS.FAVORITE_SUCCESS.status;
            output.description = statusCode.SERVICE_STATUS.FAVORITE_SUCCESS.description;
            output.data.isFavorited = true;
        } else {
            await sqldb.Favorite.create(
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
            output.success = statusCode.SERVICE_STATUS.FAVORITE_SUCCESS.success;
            output.status = statusCode.SERVICE_STATUS.FAVORITE_SUCCESS.status;
            output.description = statusCode.SERVICE_STATUS.FAVORITE_SUCCESS.description;
            output.data.isFavorited = true;
        }
    } catch (error) {
        console.log(error);
        output.success = statusCode.SERVICE_STATUS.FAVORITE_FAIL.success;
        output.status = statusCode.SERVICE_STATUS.FAVORITE_FAIL.status;
        output.description = statusCode.SERVICE_STATUS.FAVORITE_FAIL.description;
    }
    res.send(output);
    return;
});

/**
 * 获取收藏列表
 * type 对象类型【1：笔记，2：便签】
 * pageIndex 第几页
 * pageSize 每页几条
 */
router.get("/getFavoriteList", async (req, res) => {
    var output = {
        success: true,
        status: '',
        description: '',
        data: []
    }

    try {
        let userInfo = req.userInfo;
        let type = req.query.type || 1;
        let pageIndex = parseInt(req.query.pageIndex) || 0;
        let pageSize = parseInt(req.query.pageSize) || 10;
        let offset = pageIndex * pageSize;

        const { count, rows } = await sqldb.Favorite.findAndCountAll({
            where: {
                u_id: userInfo.id,
                type: type,
                status: 1
            },
            order: [['time', 'DESC']],
            limit: pageSize,
            offset: offset,
            raw: true
        });

        output.success = statusCode.SERVICE_STATUS.GET_FAVORITE_LIST_SUCCESS.success;
        output.status = statusCode.SERVICE_STATUS.GET_FAVORITE_LIST_SUCCESS.status;
        output.description = statusCode.SERVICE_STATUS.GET_FAVORITE_LIST_SUCCESS.description;
        output.data = rows;
        output.total = count;
        output.pageIndex = pageIndex;
        output.pageSize = pageSize;
    } catch (error) {
        console.log(error);
        output.success = statusCode.SERVICE_STATUS.GET_FAVORITE_LIST_FAIL.success;
        output.status = statusCode.SERVICE_STATUS.GET_FAVORITE_LIST_FAIL.status;
        output.description = statusCode.SERVICE_STATUS.GET_FAVORITE_LIST_FAIL.description;
    }
    res.send(output);
    return;
});

/**
 * 检查是否已收藏
 * objectId 对象编号
 * type 对象类型
 */
router.get("/checkFavorite", async (req, res) => {
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

        // 未登录时静默处理，前端不提示，默认未收藏
        if (!userInfo || !userInfo.id) {
            output.success = statusCode.SERVICE_STATUS.CHECK_FAVORITE_SUCCESS.success;
            output.status = statusCode.SERVICE_STATUS.CHECK_FAVORITE_SUCCESS.status;
            output.description = statusCode.SERVICE_STATUS.CHECK_FAVORITE_SUCCESS.description;
            output.data.isFavorited = false;
            res.send(output);
            return;
        }

        const record = await sqldb.Favorite.findOne({
            where: {
                u_id: userInfo.id,
                object_id: objectId,
                type: type,
                status: 1
            }
        });

        output.success = statusCode.SERVICE_STATUS.CHECK_FAVORITE_SUCCESS.success;
        output.status = statusCode.SERVICE_STATUS.CHECK_FAVORITE_SUCCESS.status;
        output.description = statusCode.SERVICE_STATUS.CHECK_FAVORITE_SUCCESS.description;
        output.data.isFavorited = !!record;
    } catch (error) {
        console.log(error);
        output.success = statusCode.SERVICE_STATUS.CHECK_FAVORITE_FAIL.success;
        output.status = statusCode.SERVICE_STATUS.CHECK_FAVORITE_FAIL.status;
        output.description = statusCode.SERVICE_STATUS.CHECK_FAVORITE_FAIL.description;
    }
    res.send(output);
    return;
});

/**
 * 获取收藏数
 * objectId 对象编号
 * type 对象类型
 */
router.get("/getCollectCount", async (req, res) => {
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

        const count = await sqldb.Favorite.count({
            where: {
                object_id: objectId,
                type: type,
                status: 1
            }
        });

        output.success = statusCode.SERVICE_STATUS.GET_FAVORITE_LIST_SUCCESS.success;
        output.status = statusCode.SERVICE_STATUS.GET_FAVORITE_LIST_SUCCESS.status;
        output.description = '获取收藏数成功';
        output.data.collectCount = count;
    } catch (error) {
        console.log(error);
        output.success = statusCode.SERVICE_STATUS.GET_FAVORITE_LIST_FAIL.success;
        output.status = statusCode.SERVICE_STATUS.GET_FAVORITE_LIST_FAIL.status;
        output.description = '获取收藏数失败';
    }
    res.send(output);
    return;
});

module.exports = router;