const express = require("express");
const { Op } = require("sequelize");

var sqldb = require('../sqldb');
let statusCode = require("./statusCode");

var router = express.Router();

/**
 * 拉黑用户
 * targetUId 被拉黑用户编号
 * reason 拉黑原因（可选）
 */
router.post("/addBlacklist", async (req, res) => {
    var output = {
        success: true,
        status: '',
        description: '',
        data: {}
    }

    try {
        let userInfo = req.userInfo;
        let targetUId = req.body.targetUId;
        let reason = req.body.reason || '';

        if (!targetUId) {
            output.success = statusCode.REDIS_STATUS.PARAM_ERROR.success;
            output.status = statusCode.REDIS_STATUS.PARAM_ERROR.status;
            output.description = statusCode.REDIS_STATUS.PARAM_ERROR.description;
            res.send(output);
            return;
        }

        if (userInfo.id === targetUId) {
            output.success = statusCode.REDIS_STATUS.PARAM_ERROR.success;
            output.status = statusCode.REDIS_STATUS.PARAM_ERROR.status;
            output.description = '不能拉黑自己';
            res.send(output);
            return;
        }

        const existing = await sqldb.Blacklist.findOne({
            where: {
                u_id: userInfo.id,
                target_u_id: targetUId
            }
        });

        if (existing && existing.status === 1) {
            output.success = statusCode.SERVICE_STATUS.ADD_BLACKLIST_SUCCESS.success;
            output.status = statusCode.SERVICE_STATUS.ADD_BLACKLIST_SUCCESS.status;
            output.description = '已在黑名单中';
            res.send(output);
            return;
        }

        if (existing && existing.status === 0) {
            await sqldb.Blacklist.update(
                { status: 1, reason: reason, time: new Date().toLocaleString() },
                { where: { id: existing.id } }
            );
        } else {
            await sqldb.Blacklist.create({
                u_id: userInfo.id,
                target_u_id: targetUId,
                reason: reason,
                time: new Date().toLocaleString(),
                status: 1
            });
        }

        output.success = statusCode.SERVICE_STATUS.ADD_BLACKLIST_SUCCESS.success;
        output.status = statusCode.SERVICE_STATUS.ADD_BLACKLIST_SUCCESS.status;
        output.description = statusCode.SERVICE_STATUS.ADD_BLACKLIST_SUCCESS.description;
    } catch (error) {
        console.log(error);
        output.success = statusCode.SERVICE_STATUS.ADD_BLACKLIST_FAIL.success;
        output.status = statusCode.SERVICE_STATUS.ADD_BLACKLIST_FAIL.status;
        output.description = statusCode.SERVICE_STATUS.ADD_BLACKLIST_FAIL.description;
    }
    res.send(output);
    return;
});

/**
 * 解除拉黑
 * targetUId 被拉黑用户编号
 */
router.post("/removeBlacklist", async (req, res) => {
    var output = {
        success: true,
        status: '',
        description: '',
        data: {}
    }

    try {
        let userInfo = req.userInfo;
        let targetUId = req.body.targetUId;

        if (!targetUId) {
            output.success = statusCode.REDIS_STATUS.PARAM_ERROR.success;
            output.status = statusCode.REDIS_STATUS.PARAM_ERROR.status;
            output.description = statusCode.REDIS_STATUS.PARAM_ERROR.description;
            res.send(output);
            return;
        }

        const updated = await sqldb.Blacklist.update(
            { status: 0 },
            {
                where: {
                    u_id: userInfo.id,
                    target_u_id: targetUId,
                    status: 1
                }
            }
        );

        if (updated > 0) {
            output.success = statusCode.SERVICE_STATUS.REMOVE_BLACKLIST_SUCCESS.success;
            output.status = statusCode.SERVICE_STATUS.REMOVE_BLACKLIST_SUCCESS.status;
            output.description = statusCode.SERVICE_STATUS.REMOVE_BLACKLIST_SUCCESS.description;
        } else {
            output.success = statusCode.SERVICE_STATUS.REMOVE_BLACKLIST_FAIL.success;
            output.status = statusCode.SERVICE_STATUS.REMOVE_BLACKLIST_FAIL.status;
            output.description = '未找到拉黑记录';
        }
    } catch (error) {
        console.log(error);
        output.success = statusCode.SERVICE_STATUS.REMOVE_BLACKLIST_FAIL.success;
        output.status = statusCode.SERVICE_STATUS.REMOVE_BLACKLIST_FAIL.status;
        output.description = statusCode.SERVICE_STATUS.REMOVE_BLACKLIST_FAIL.description;
    }
    res.send(output);
    return;
});

/**
 * 获取黑名单列表
 * pageIndex 第几页
 * pageSize 每页几条
 */
router.get("/getBlacklist", async (req, res) => {
    var output = {
        success: true,
        status: '',
        description: '',
        data: []
    }

    try {
        let userInfo = req.userInfo;
        let pageIndex = parseInt(req.query.pageIndex) || 0;
        let pageSize = parseInt(req.query.pageSize) || 10;
        let offset = pageIndex * pageSize;

        const { count, rows } = await sqldb.Blacklist.findAndCountAll({
            where: {
                u_id: userInfo.id,
                status: 1
            },
            include: [
                {
                    model: sqldb.User,
                    as: 'TargetUser',
                    attributes: ['id', 'nickname', 'head_pic']
                }
            ],
            order: [['time', 'DESC']],
            limit: pageSize,
            offset: offset
        });

        let blacklist = [];
        for (let row of rows) {
            let item = {
                id: row.id,
                target_u_id: row.target_u_id,
                reason: row.reason,
                time: row.time,
                nickname: row.TargetUser ? row.TargetUser.nickname : '',
                head_pic: row.TargetUser ? row.TargetUser.head_pic : ''
            };
            blacklist.push(item);
        }

        output.success = statusCode.SERVICE_STATUS.GET_BLACKLIST_SUCCESS.success;
        output.status = statusCode.SERVICE_STATUS.GET_BLACKLIST_SUCCESS.status;
        output.description = statusCode.SERVICE_STATUS.GET_BLACKLIST_SUCCESS.description;
        output.data = blacklist;
        output.total = count;
        output.pageIndex = pageIndex;
        output.pageSize = pageSize;
    } catch (error) {
        console.log(error);
        output.success = statusCode.SERVICE_STATUS.GET_BLACKLIST_FAIL.success;
        output.status = statusCode.SERVICE_STATUS.GET_BLACKLIST_FAIL.status;
        output.description = statusCode.SERVICE_STATUS.GET_BLACKLIST_FAIL.description;
    }
    res.send(output);
    return;
});

/**
 * 检查某用户是否在我的黑名单中
 * targetUId 目标用户编号
 */
router.get("/isBlacklisted", async (req, res) => {
    var output = {
        success: true,
        status: '',
        description: '',
        data: {}
    }

    try {
        let userInfo = req.userInfo;
        let targetUId = req.query.targetUId;

        if (!targetUId) {
            output.success = statusCode.REDIS_STATUS.PARAM_ERROR.success;
            output.status = statusCode.REDIS_STATUS.PARAM_ERROR.status;
            output.description = statusCode.REDIS_STATUS.PARAM_ERROR.description;
            res.send(output);
            return;
        }

        const record = await sqldb.Blacklist.findOne({
            where: {
                u_id: userInfo.id,
                target_u_id: targetUId,
                status: 1
            }
        });

        output.success = statusCode.SERVICE_STATUS.CHECK_BLACKLIST_SUCCESS.success;
        output.status = statusCode.SERVICE_STATUS.CHECK_BLACKLIST_SUCCESS.status;
        output.description = statusCode.SERVICE_STATUS.CHECK_BLACKLIST_SUCCESS.description;
        output.data.isBlacklisted = !!record;
    } catch (error) {
        console.log(error);
        output.success = statusCode.SERVICE_STATUS.CHECK_BLACKLIST_FAIL.success;
        output.status = statusCode.SERVICE_STATUS.CHECK_BLACKLIST_FAIL.status;
        output.description = statusCode.SERVICE_STATUS.CHECK_BLACKLIST_FAIL.description;
    }
    res.send(output);
    return;
});

module.exports = router;