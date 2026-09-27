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
        // 可见性：勾选「仅自己可见」=私有(1)，未勾选=公开(2)，缺省按公开处理
        let targetStatus = parseInt(req.body.status);
        if (targetStatus !== 1 && targetStatus !== 2) {
            targetStatus = 2;
        }

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
            status: targetStatus
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
        // 可选的精确状态过滤：传了则按该状态查询，否则默认排除已删除(status:0)
        let queryStatus = req.query.status;
        let statusCond = { [Op.ne]: 0 };
        if (queryStatus !== undefined && queryStatus !== '' && !isNaN(parseInt(queryStatus))) {
            statusCond = parseInt(queryStatus);
        }
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
                status: statusCond
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
                status: row.status,
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

/**
 * 删除说说（软删除，仅作者本人可操作）
 * momentId 说说编号
 */
router.post("/deleteMoment", async (req, res) => {
    var output = {
        success: true,
        status: '',
        description: '',
        data: {}
    }

    logger.info('start delete moment')
    try {
        let userInfo = req.userInfo;
        let momentId = req.body.momentId;

        if (!userInfo || !userInfo.id) {
            output.success = statusCode.REDIS_STATUS.PARAM_ERROR.success;
            output.status = statusCode.REDIS_STATUS.PARAM_ERROR.status;
            output.description = statusCode.REDIS_STATUS.PARAM_ERROR.description;
            res.send(output);
            return;
        }

        if (!momentId) {
            output.success = statusCode.REDIS_STATUS.PARAM_ERROR.success;
            output.status = statusCode.REDIS_STATUS.PARAM_ERROR.status;
            output.description = statusCode.REDIS_STATUS.PARAM_ERROR.description;
            res.send(output);
            return;
        }

        const moment = await sqldb.Moment.findOne({
            where: { id: momentId, u_id: userInfo.id, status: { [Op.ne]: 0 } }
        });

        if (!moment) {
            output.success = statusCode.SERVICE_STATUS.RESOURCE_NOT_FOUND.success;
            output.status = statusCode.SERVICE_STATUS.RESOURCE_NOT_FOUND.status;
            output.description = statusCode.SERVICE_STATUS.RESOURCE_NOT_FOUND.description;
            res.send(output);
            return;
        }

        await moment.update({ status: 0 });

        output.success = statusCode.SERVICE_STATUS.DELETE_MOMENT_SUCCESS.success;
        output.status = statusCode.SERVICE_STATUS.DELETE_MOMENT_SUCCESS.status;
        output.description = statusCode.SERVICE_STATUS.DELETE_MOMENT_SUCCESS.description;
    } catch (error) {
        console.log(error);
        output.success = statusCode.SERVICE_STATUS.DELETE_MOMENT_FAIL.success;
        output.status = statusCode.SERVICE_STATUS.DELETE_MOMENT_FAIL.status;
        output.description = statusCode.SERVICE_STATUS.DELETE_MOMENT_FAIL.description;
    }

    logger.info('end delete moment')

    res.send(output);
    return;
});

/**
 * 更新说说可见性（仅作者本人可操作）
 * momentId    说说编号
 * targetStatus 目标状态【1：私有/仅自己可见，2：公开】
 */
router.post("/updateMomentStatus", async (req, res) => {
    var output = {
        success: true,
        status: '',
        description: '',
        data: {}
    }

    logger.info('start update moment status')
    try {
        let userInfo = req.userInfo;
        let momentId = req.body.momentId;
        let targetStatus = parseInt(req.body.targetStatus);

        if (!userInfo || !userInfo.id) {
            output.success = statusCode.REDIS_STATUS.PARAM_ERROR.success;
            output.status = statusCode.REDIS_STATUS.PARAM_ERROR.status;
            output.description = statusCode.REDIS_STATUS.PARAM_ERROR.description;
            res.send(output);
            return;
        }

        if (!momentId || (targetStatus !== 1 && targetStatus !== 2)) {
            output.success = statusCode.REDIS_STATUS.PARAM_ERROR.success;
            output.status = statusCode.REDIS_STATUS.PARAM_ERROR.status;
            output.description = statusCode.REDIS_STATUS.PARAM_ERROR.description;
            res.send(output);
            return;
        }

        const moment = await sqldb.Moment.findOne({
            where: { id: momentId, u_id: userInfo.id, status: { [Op.ne]: 0 } }
        });

        if (!moment) {
            output.success = statusCode.SERVICE_STATUS.RESOURCE_NOT_FOUND.success;
            output.status = statusCode.SERVICE_STATUS.RESOURCE_NOT_FOUND.status;
            output.description = statusCode.SERVICE_STATUS.RESOURCE_NOT_FOUND.description;
            res.send(output);
            return;
        }

        await moment.update({ status: targetStatus });

        output.success = statusCode.SERVICE_STATUS.UPDATE_MOMENT_STATUS_SUCCESS.success;
        output.status = statusCode.SERVICE_STATUS.UPDATE_MOMENT_STATUS_SUCCESS.status;
        output.description = statusCode.SERVICE_STATUS.UPDATE_MOMENT_STATUS_SUCCESS.description;
        output.data = { status: targetStatus };
    } catch (error) {
        console.log(error);
        output.success = statusCode.SERVICE_STATUS.UPDATE_MOMENT_STATUS_FAIL.success;
        output.status = statusCode.SERVICE_STATUS.UPDATE_MOMENT_STATUS_FAIL.status;
        output.description = statusCode.SERVICE_STATUS.UPDATE_MOMENT_STATUS_FAIL.description;
    }

    logger.info('end update moment status')

    res.send(output);
    return;
});

/**
 * 获取当前用户已删除（status=0）的说说列表（回收站）
 */
router.get("/getDeletedMomentList", async (req, res) => {
    var output = {
        success: true,
        status: '',
        description: '',
        data: []
    }

    logger.info('start get deleted moment list')
    try {
        let uId = req.userInfo && req.userInfo.id;
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
                status: 0
            },
            order: [['time', 'DESC']],
            limit: 200
        });

        let momentList = rows.map(row => ({
            id: row.id,
            content: row.content,
            images: row.images,
            time: row.time,
            status: row.status,
            u_id: row.u_id
        }));

        output.success = statusCode.SERVICE_STATUS.GET_DELETED_MOMENT_LIST_SUCCESS.success;
        output.status = statusCode.SERVICE_STATUS.GET_DELETED_MOMENT_LIST_SUCCESS.status;
        output.description = statusCode.SERVICE_STATUS.GET_DELETED_MOMENT_LIST_SUCCESS.description;
        output.data = momentList;
        output.total = count;
    } catch (error) {
        console.log(error);
        output.success = statusCode.SERVICE_STATUS.GET_DELETED_MOMENT_LIST_FAIL.success;
        output.status = statusCode.SERVICE_STATUS.GET_DELETED_MOMENT_LIST_FAIL.status;
        output.description = statusCode.SERVICE_STATUS.GET_DELETED_MOMENT_LIST_FAIL.description;
    }

    logger.info('end get deleted moment list')
    res.send(output);
    return;
});

/**
 * 恢复说说：将 status 由 0 还原为 1（仅自己可见）
 * momentId 说说编号
 */
router.post("/restoreMoment", async (req, res) => {
    var output = {
        success: true,
        status: '',
        description: '',
        data: {}
    }

    logger.info('start restore moment')
    try {
        let userInfo = req.userInfo;
        let momentId = req.body.momentId;

        if (!userInfo || !userInfo.id) {
            output.success = statusCode.REDIS_STATUS.PARAM_ERROR.success;
            output.status = statusCode.REDIS_STATUS.PARAM_ERROR.status;
            output.description = statusCode.REDIS_STATUS.PARAM_ERROR.description;
            res.send(output);
            return;
        }
        if (!momentId) {
            output.success = statusCode.REDIS_STATUS.PARAM_ERROR.success;
            output.status = statusCode.REDIS_STATUS.PARAM_ERROR.status;
            output.description = statusCode.REDIS_STATUS.PARAM_ERROR.description;
            res.send(output);
            return;
        }

        const moment = await sqldb.Moment.findOne({
            where: { id: momentId, u_id: userInfo.id, status: 0 }
        });

        if (!moment) {
            output.success = statusCode.SERVICE_STATUS.RESOURCE_NOT_FOUND.success;
            output.status = statusCode.SERVICE_STATUS.RESOURCE_NOT_FOUND.status;
            output.description = statusCode.SERVICE_STATUS.RESOURCE_NOT_FOUND.description;
            res.send(output);
            return;
        }

        await moment.update({ status: 1 });

        output.success = statusCode.SERVICE_STATUS.RESTORE_MOMENT_SUCCESS.success;
        output.status = statusCode.SERVICE_STATUS.RESTORE_MOMENT_SUCCESS.status;
        output.description = statusCode.SERVICE_STATUS.RESTORE_MOMENT_SUCCESS.description;
    } catch (error) {
        console.log(error);
        output.success = statusCode.SERVICE_STATUS.RESTORE_MOMENT_FAIL.success;
        output.status = statusCode.SERVICE_STATUS.RESTORE_MOMENT_FAIL.status;
        output.description = statusCode.SERVICE_STATUS.RESTORE_MOMENT_FAIL.description;
    }

    logger.info('end restore moment')
    res.send(output);
    return;
});

/**
 * 彻底删除说说（物理删除，仅作者本人可操作）
 * momentId 说说编号
 */
router.post("/deleteMomentPermanent", async (req, res) => {
    var output = {
        success: true,
        status: '',
        description: '',
        data: {}
    }

    logger.info('start delete moment permanent')
    try {
        let userInfo = req.userInfo;
        let momentId = req.body.momentId;

        if (!userInfo || !userInfo.id) {
            output.success = statusCode.REDIS_STATUS.PARAM_ERROR.success;
            output.status = statusCode.REDIS_STATUS.PARAM_ERROR.status;
            output.description = statusCode.REDIS_STATUS.PARAM_ERROR.description;
            res.send(output);
            return;
        }
        if (!momentId) {
            output.success = statusCode.REDIS_STATUS.PARAM_ERROR.success;
            output.status = statusCode.REDIS_STATUS.PARAM_ERROR.status;
            output.description = statusCode.REDIS_STATUS.PARAM_ERROR.description;
            res.send(output);
            return;
        }

        const result = await sqldb.Moment.destroy({
            where: { id: momentId, u_id: userInfo.id, status: 0 }
        });

        if (!result) {
            output.success = statusCode.SERVICE_STATUS.RESOURCE_NOT_FOUND.success;
            output.status = statusCode.SERVICE_STATUS.RESOURCE_NOT_FOUND.status;
            output.description = statusCode.SERVICE_STATUS.RESOURCE_NOT_FOUND.description;
            res.send(output);
            return;
        }

        output.success = statusCode.SERVICE_STATUS.DELETE_MOMENT_PERMANENT_SUCCESS.success;
        output.status = statusCode.SERVICE_STATUS.DELETE_MOMENT_PERMANENT_SUCCESS.status;
        output.description = statusCode.SERVICE_STATUS.DELETE_MOMENT_PERMANENT_SUCCESS.description;
    } catch (error) {
        console.log(error);
        output.success = statusCode.SERVICE_STATUS.DELETE_MOMENT_PERMANENT_FAIL.success;
        output.status = statusCode.SERVICE_STATUS.DELETE_MOMENT_PERMANENT_FAIL.status;
        output.description = statusCode.SERVICE_STATUS.DELETE_MOMENT_PERMANENT_FAIL.description;
    }

    logger.info('end delete moment permanent')
    res.send(output);
    return;
});

module.exports = router;
