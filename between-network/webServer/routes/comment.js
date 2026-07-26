const express = require("express");
const { Op } = require("sequelize");

var sqldb = require('../sqldb');
let statusCode = require("./statusCode");

var router = express.Router();

/**
 * 发表评论
 * objectId 对象编号
 * type 对象类型【1：笔记，2：便签】
 * content 评论内容
 */
router.post("/addComment", async (req, res) => {
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
        let content = req.body.content;

        if (!objectId || !content || content.trim().length === 0) {
            output.success = statusCode.REDIS_STATUS.PARAM_ERROR.success;
            output.status = statusCode.REDIS_STATUS.PARAM_ERROR.status;
            output.description = statusCode.REDIS_STATUS.PARAM_ERROR.description;
            res.send(output);
            return;
        }

        let curTime = new Date().toLocaleString();

        const newComment = await sqldb.Comment.create({
            u_id: userInfo.id,
            object_id: objectId,
            type: type,
            content: content,
            time: curTime,
            status: 1
        });

        output.success = statusCode.SERVICE_STATUS.ADD_COMMENT_SUCCESS.success;
        output.status = statusCode.SERVICE_STATUS.ADD_COMMENT_SUCCESS.status;
        output.description = statusCode.SERVICE_STATUS.ADD_COMMENT_SUCCESS.description;
        output.data.commentId = newComment.id;
    } catch (error) {
        console.log(error);
        output.success = statusCode.SERVICE_STATUS.ADD_COMMENT_FAIL.success;
        output.status = statusCode.SERVICE_STATUS.ADD_COMMENT_FAIL.status;
        output.description = statusCode.SERVICE_STATUS.ADD_COMMENT_FAIL.description;
    }
    res.send(output);
    return;
});

/**
 * 获取评论列表
 * objectId 对象编号
 * type 对象类型
 * pageIndex 第几页
 * pageSize 每页几条
 */
router.get("/getCommentList", async (req, res) => {
    var output = {
        success: true,
        status: '',
        description: '',
        data: []
    }

    try {
        let objectId = req.query.objectId;
        let type = req.query.type || 1;
        let pageIndex = parseInt(req.query.pageIndex) || 0;
        let pageSize = parseInt(req.query.pageSize) || 10;
        let offset = pageIndex * pageSize;

        if (!objectId) {
            output.success = statusCode.REDIS_STATUS.PARAM_ERROR.success;
            output.status = statusCode.REDIS_STATUS.PARAM_ERROR.status;
            output.description = statusCode.REDIS_STATUS.PARAM_ERROR.description;
            res.send(output);
            return;
        }

        const { count, rows } = await sqldb.Comment.findAndCountAll({
            where: {
                object_id: objectId,
                type: type,
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

        let commentList = [];
        for (let row of rows) {
            let item = {
                id: row.id,
                content: row.content,
                time: row.time,
                u_id: row.u_id,
                nickname: row.User ? row.User.nickname : '',
                head_pic: row.User ? row.User.head_pic : ''
            };
            commentList.push(item);
        }

        output.success = statusCode.SERVICE_STATUS.GET_COMMENT_LIST_SUCCESS.success;
        output.status = statusCode.SERVICE_STATUS.GET_COMMENT_LIST_SUCCESS.status;
        output.description = statusCode.SERVICE_STATUS.GET_COMMENT_LIST_SUCCESS.description;
        output.data = commentList;
        output.total = count;
        output.pageIndex = pageIndex;
        output.pageSize = pageSize;
    } catch (error) {
        console.log(error);
        output.success = statusCode.SERVICE_STATUS.GET_COMMENT_LIST_FAIL.success;
        output.status = statusCode.SERVICE_STATUS.GET_COMMENT_LIST_FAIL.status;
        output.description = statusCode.SERVICE_STATUS.GET_COMMENT_LIST_FAIL.description;
    }
    res.send(output);
    return;
});

/**
 * 删除评论（仅评论作者可删除）
 * commentId 评论编号
 */
router.post("/deleteComment", async (req, res) => {
    var output = {
        success: true,
        status: '',
        description: '',
        data: {}
    }

    try {
        let userInfo = req.userInfo;
        let commentId = req.body.commentId;

        if (!commentId) {
            output.success = statusCode.REDIS_STATUS.PARAM_ERROR.success;
            output.status = statusCode.REDIS_STATUS.PARAM_ERROR.status;
            output.description = statusCode.REDIS_STATUS.PARAM_ERROR.description;
            res.send(output);
            return;
        }

        const comment = await sqldb.Comment.findOne({
            where: { id: commentId }
        });

        if (!comment) {
            output.success = statusCode.SERVICE_STATUS.DEL_COMMENT_FAIL.success;
            output.status = statusCode.SERVICE_STATUS.DEL_COMMENT_FAIL.status;
            output.description = '评论不存在';
            res.send(output);
            return;
        }

        if (comment.u_id !== userInfo.id) {
            output.success = statusCode.SERVICE_STATUS.DEL_COMMENT_FAIL.success;
            output.status = statusCode.SERVICE_STATUS.DEL_COMMENT_FAIL.status;
            output.description = '无权删除他人评论';
            res.send(output);
            return;
        }

        await sqldb.Comment.update(
            { status: 0 },
            { where: { id: commentId } }
        );

        output.success = statusCode.SERVICE_STATUS.DEL_COMMENT_SUCCESS.success;
        output.status = statusCode.SERVICE_STATUS.DEL_COMMENT_SUCCESS.status;
        output.description = statusCode.SERVICE_STATUS.DEL_COMMENT_SUCCESS.description;
    } catch (error) {
        console.log(error);
        output.success = statusCode.SERVICE_STATUS.DEL_COMMENT_FAIL.success;
        output.status = statusCode.SERVICE_STATUS.DEL_COMMENT_FAIL.status;
        output.description = statusCode.SERVICE_STATUS.DEL_COMMENT_FAIL.description;
    }
    res.send(output);
    return;
});

/**
 * 获取评论数
 * objectId 对象编号
 * type 对象类型
 */
router.get("/getCommentCount", async (req, res) => {
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

        const count = await sqldb.Comment.count({
            where: {
                object_id: objectId,
                type: type,
                status: 1
            }
        });

        output.success = statusCode.SERVICE_STATUS.GET_COMMENT_LIST_SUCCESS.success;
        output.status = statusCode.SERVICE_STATUS.GET_COMMENT_LIST_SUCCESS.status;
        output.description = '获取评论数成功';
        output.data.commentCount = count;
    } catch (error) {
        console.log(error);
        output.success = statusCode.SERVICE_STATUS.GET_COMMENT_LIST_FAIL.success;
        output.status = statusCode.SERVICE_STATUS.GET_COMMENT_LIST_FAIL.status;
        output.description = '获取评论数失败';
    }
    res.send(output);
    return;
});

module.exports = router;