const express = require("express");
const { Op } = require("sequelize");

var sqldb = require('../sqldb');
let statusCode = require("./statusCode");

var router = express.Router();

/**
 * 评论对象类型：3 表示需求（1：笔记，2：便签）
 */
const COMMENT_TYPE_DEMAND = 3;

/**
 * 点赞对象类型：3 表示需求（1：笔记，2：便签）
 */
const LIKE_TYPE_DEMAND = 3;

/**
 * 提交需求
 * content 需求正文
 * contact 联系方式（选填）
 */
router.post("/addDemand", async (req, res) => {
    var output = {
        success: true,
        status: '',
        description: '',
        data: {}
    }

    logger.info('start add feedback demand')
    try {
        let userInfo = req.userInfo;
        let content = req.body.content;
        let contact = req.body.contact || '';

        if (!content || content.trim().length === 0) {
            output.success = statusCode.SERVICE_STATUS.PARAM_ERROR.success;
            output.status = statusCode.SERVICE_STATUS.PARAM_ERROR.status;
            output.description = statusCode.SERVICE_STATUS.PARAM_ERROR.description;
            res.send(output);
            return;
        }

        let curTime = new Date().toLocaleString();

        const newDemand = await sqldb.FeedbackDemand.create({
            u_id: userInfo ? userInfo.id : null,
            content: content,
            contact: contact,
            step: 0,          // 初始为「需求提交」
            progress: 0,
            vote: 0,
            time: curTime,
            update_time: curTime,
            status: 1
        });

        output.success = statusCode.SERVICE_STATUS.ADD_FEEDBACK_SUCCESS.success;
        output.status = statusCode.SERVICE_STATUS.ADD_FEEDBACK_SUCCESS.status;
        output.description = statusCode.SERVICE_STATUS.ADD_FEEDBACK_SUCCESS.description;
        output.data.demandId = newDemand.id;
    } catch (error) {
        console.log(error);
        output.success = statusCode.SERVICE_STATUS.ADD_FEEDBACK_FAIL.success;
        output.status = statusCode.SERVICE_STATUS.ADD_FEEDBACK_FAIL.status;
        output.description = statusCode.SERVICE_STATUS.ADD_FEEDBACK_FAIL.description;
    }

    logger.info('end add feedback demand')

    res.send(output);
    return;
});

/**
 * 提交问题
 * content 问题描述
 * contact 联系方式（选填）
 * level 严重程度【1：轻微，2：一般，3：严重】
 */
router.post("/addIssue", async (req, res) => {
    var output = {
        success: true,
        status: '',
        description: '',
        data: {}
    }

    logger.info('start add feedback issue')
    try {
        let userInfo = req.userInfo;
        let content = req.body.content;
        let contact = req.body.contact || '';
        let level = parseInt(req.body.level) || 1;

        if (!content || content.trim().length === 0) {
            output.success = statusCode.SERVICE_STATUS.PARAM_ERROR.success;
            output.status = statusCode.SERVICE_STATUS.PARAM_ERROR.status;
            output.description = statusCode.SERVICE_STATUS.PARAM_ERROR.description;
            res.send(output);
            return;
        }

        //严重程度只允许 1-3
        if (level < 1 || level > 3) {
            level = 1;
        }

        let curTime = new Date().toLocaleString();

        const newIssue = await sqldb.FeedbackIssue.create({
            u_id: userInfo ? userInfo.id : null,
            content: content,
            contact: contact,
            level: level,
            handle_status: 0,   // 初始为「待确认」
            time: curTime,
            update_time: curTime,
            status: 1
        });

        output.success = statusCode.SERVICE_STATUS.ADD_FEEDBACK_SUCCESS.success;
        output.status = statusCode.SERVICE_STATUS.ADD_FEEDBACK_SUCCESS.status;
        output.description = statusCode.SERVICE_STATUS.ADD_FEEDBACK_SUCCESS.description;
        output.data.issueId = newIssue.id;
    } catch (error) {
        console.log(error);
        output.success = statusCode.SERVICE_STATUS.ADD_FEEDBACK_FAIL.success;
        output.status = statusCode.SERVICE_STATUS.ADD_FEEDBACK_FAIL.status;
        output.description = statusCode.SERVICE_STATUS.ADD_FEEDBACK_FAIL.description;
    }

    logger.info('end add feedback issue')

    res.send(output);
    return;
});

/**
 * 获取需求列表
 * pageIndex 第几页
 * pageSize 每页几条
 */
router.get("/getDemandList", async (req, res) => {
    var output = {
        success: true,
        status: '',
        description: '',
        data: []
    }

    logger.info('start get feedback demand list')

    try {
        let pageIndex = parseInt(req.query.pageIndex) || 0;
        let pageSize = parseInt(req.query.pageSize) || 10;
        let offset = pageIndex * pageSize;

        const { count, rows } = await sqldb.FeedbackDemand.findAndCountAll({
            where: { status: 1 },
            include: [
                {
                    model: sqldb.User,
                    as: 'User',
                    attributes: ['id', 'nickname']
                }
            ],
            order: [['time', 'DESC']],
            limit: pageSize,
            offset: offset
        });

        let demandList = [];
        for (let row of rows) {
            demandList.push({
                id: row.id,
                content: row.content,
                step: row.step,
                progress: row.progress,
                vote: row.vote,
                time: row.time,
                u_id: row.u_id,
                submitter: row.User ? row.User.nickname : '匿名用户'
            });
        }

        output.success = statusCode.SERVICE_STATUS.GET_FEEDBACK_LIST_SUCCESS.success;
        output.status = statusCode.SERVICE_STATUS.GET_FEEDBACK_LIST_SUCCESS.status;
        output.description = statusCode.SERVICE_STATUS.GET_FEEDBACK_LIST_SUCCESS.description;
        output.data = demandList;
        output.total = count;
        output.pageIndex = pageIndex;
        output.pageSize = pageSize;
    } catch (error) {
        console.log(error);
        output.success = statusCode.SERVICE_STATUS.GET_FEEDBACK_LIST_FAIL.success;
        output.status = statusCode.SERVICE_STATUS.GET_FEEDBACK_LIST_FAIL.status;
        output.description = statusCode.SERVICE_STATUS.GET_FEEDBACK_LIST_FAIL.description;
    }

    logger.info('end get feedback demand list')

    res.send(output);
    return;
});

/**
 * 获取问题列表
 * pageIndex 第几页
 * pageSize 每页几条
 */
router.get("/getIssueList", async (req, res) => {
    var output = {
        success: true,
        status: '',
        description: '',
        data: []
    }

    logger.info('start get feedback issue list')

    try {
        let pageIndex = parseInt(req.query.pageIndex) || 0;
        let pageSize = parseInt(req.query.pageSize) || 10;
        let offset = pageIndex * pageSize;

        const { count, rows } = await sqldb.FeedbackIssue.findAndCountAll({
            where: { status: 1 },
            include: [
                {
                    model: sqldb.User,
                    as: 'User',
                    attributes: ['id', 'nickname']
                }
            ],
            order: [['time', 'DESC']],
            limit: pageSize,
            offset: offset
        });

        let issueList = [];
        for (let row of rows) {
            issueList.push({
                id: row.id,
                content: row.content,
                level: row.level,
                handle_status: row.handle_status,
                handle_desc: row.handle_desc,
                time: row.time,
                u_id: row.u_id,
                submitter: row.User ? row.User.nickname : '匿名用户'
            });
        }

        output.success = statusCode.SERVICE_STATUS.GET_FEEDBACK_LIST_SUCCESS.success;
        output.status = statusCode.SERVICE_STATUS.GET_FEEDBACK_LIST_SUCCESS.status;
        output.description = statusCode.SERVICE_STATUS.GET_FEEDBACK_LIST_SUCCESS.description;
        output.data = issueList;
        output.total = count;
        output.pageIndex = pageIndex;
        output.pageSize = pageSize;
    } catch (error) {
        console.log(error);
        output.success = statusCode.SERVICE_STATUS.GET_FEEDBACK_LIST_FAIL.success;
        output.status = statusCode.SERVICE_STATUS.GET_FEEDBACK_LIST_FAIL.status;
        output.description = statusCode.SERVICE_STATUS.GET_FEEDBACK_LIST_FAIL.description;
    }

    logger.info('end get feedback issue list')

    res.send(output);
    return;
});

/**
 * 获取需求详情（含评论）
 * demandId 需求编号
 */
router.get("/getDemandDetail", async (req, res) => {
    var output = {
        success: true,
        status: '',
        description: '',
        data: {}
    }

    logger.info('start get feedback demand detail')

    try {
        let demandId = req.query.demandId;

        if (!demandId) {
            output.success = statusCode.SERVICE_STATUS.PARAM_ERROR.success;
            output.status = statusCode.SERVICE_STATUS.PARAM_ERROR.status;
            output.description = statusCode.SERVICE_STATUS.PARAM_ERROR.description;
            res.send(output);
            return;
        }

        const demand = await sqldb.FeedbackDemand.findOne({
            where: { id: demandId, status: 1 },
            include: [
                {
                    model: sqldb.User,
                    as: 'User',
                    attributes: ['id', 'nickname', 'head_pic']
                }
            ]
        });

        if (!demand) {
            output.success = statusCode.SERVICE_STATUS.RESOURCE_NOT_FOUND.success;
            output.status = statusCode.SERVICE_STATUS.RESOURCE_NOT_FOUND.status;
            output.description = statusCode.SERVICE_STATUS.RESOURCE_NOT_FOUND.description;
            res.send(output);
            return;
        }

        //需求下的评论
        const comments = await sqldb.Comment.findAll({
            where: {
                object_id: demandId,
                type: COMMENT_TYPE_DEMAND,
                status: 1
            },
            include: [
                {
                    model: sqldb.User,
                    as: 'User',
                    attributes: ['id', 'nickname', 'head_pic']
                }
            ],
            order: [['time', 'ASC']]
        });

        let commentList = [];
        for (let comment of comments) {
            commentList.push({
                id: comment.id,
                content: comment.content,
                time: comment.time,
                u_id: comment.u_id,
                user: comment.User ? comment.User.nickname : '匿名用户',
                head_pic: comment.User ? comment.User.head_pic : ''
            });
        }

        output.success = statusCode.SERVICE_STATUS.GET_FEEDBACK_DETAIL_SUCCESS.success;
        output.status = statusCode.SERVICE_STATUS.GET_FEEDBACK_DETAIL_SUCCESS.status;
        output.description = statusCode.SERVICE_STATUS.GET_FEEDBACK_DETAIL_SUCCESS.description;
        output.data = {
            id: demand.id,
            content: demand.content,
            contact: demand.contact,
            step: demand.step,
            progress: demand.progress,
            vote: demand.vote,
            time: demand.time,
            u_id: demand.u_id,
            submitter: demand.User ? demand.User.nickname : '匿名用户',
            comments: commentList
        };
    } catch (error) {
        console.log(error);
        output.success = statusCode.SERVICE_STATUS.GET_FEEDBACK_DETAIL_FAIL.success;
        output.status = statusCode.SERVICE_STATUS.GET_FEEDBACK_DETAIL_FAIL.status;
        output.description = statusCode.SERVICE_STATUS.GET_FEEDBACK_DETAIL_FAIL.description;
    }

    logger.info('end get feedback demand detail')

    res.send(output);
    return;
});

/**
 * 发表需求评论
 * demandId 需求编号
 * content 评论内容
 */
router.post("/addComment", async (req, res) => {
    var output = {
        success: true,
        status: '',
        description: '',
        data: {}
    }

    logger.info('start add feedback comment')

    try {
        let userInfo = req.userInfo;
        let demandId = req.body.demandId;
        let content = req.body.content;

        if (!demandId || !content || content.trim().length === 0) {
            output.success = statusCode.SERVICE_STATUS.PARAM_ERROR.success;
            output.status = statusCode.SERVICE_STATUS.PARAM_ERROR.status;
            output.description = statusCode.SERVICE_STATUS.PARAM_ERROR.description;
            res.send(output);
            return;
        }

        const demand = await sqldb.FeedbackDemand.findOne({
            where: { id: demandId, status: 1 }
        });

        if (!demand) {
            output.success = statusCode.SERVICE_STATUS.RESOURCE_NOT_FOUND.success;
            output.status = statusCode.SERVICE_STATUS.RESOURCE_NOT_FOUND.status;
            output.description = statusCode.SERVICE_STATUS.RESOURCE_NOT_FOUND.description;
            res.send(output);
            return;
        }

        let curTime = new Date().toLocaleString();

        const newComment = await sqldb.Comment.create({
            u_id: userInfo ? userInfo.id : null,
            object_id: demandId,
            type: COMMENT_TYPE_DEMAND,
            content: content,
            time: curTime,
            status: 1
        });

        output.success = statusCode.SERVICE_STATUS.ADD_FEEDBACK_COMMENT_SUCCESS.success;
        output.status = statusCode.SERVICE_STATUS.ADD_FEEDBACK_COMMENT_SUCCESS.status;
        output.description = statusCode.SERVICE_STATUS.ADD_FEEDBACK_COMMENT_SUCCESS.description;
        output.data.commentId = newComment.id;
    } catch (error) {
        console.log(error);
        output.success = statusCode.SERVICE_STATUS.ADD_FEEDBACK_COMMENT_FAIL.success;
        output.status = statusCode.SERVICE_STATUS.ADD_FEEDBACK_COMMENT_FAIL.status;
        output.description = statusCode.SERVICE_STATUS.ADD_FEEDBACK_COMMENT_FAIL.description;
    }

    logger.info('end add feedback comment')

    res.send(output);
    return;
});

/**
 * 给需求投票（期待这个功能）
 * demandId 需求编号
 */
router.post("/voteDemand", async (req, res) => {
    var output = {
        success: true,
        status: '',
        description: '',
        data: {}
    }

    logger.info('start vote feedback demand')

    try {
        let userInfo = req.userInfo;
        let demandId = req.body.demandId;

        if (!demandId || !userInfo) {
            output.success = statusCode.SERVICE_STATUS.PARAM_ERROR.success;
            output.status = statusCode.SERVICE_STATUS.PARAM_ERROR.status;
            output.description = !userInfo ? '登录后才能投票' : statusCode.SERVICE_STATUS.PARAM_ERROR.description;
            res.send(output);
            return;
        }

        const demand = await sqldb.FeedbackDemand.findOne({
            where: { id: demandId, status: 1 }
        });

        if (!demand) {
            output.success = statusCode.SERVICE_STATUS.RESOURCE_NOT_FOUND.success;
            output.status = statusCode.SERVICE_STATUS.RESOURCE_NOT_FOUND.status;
            output.description = statusCode.SERVICE_STATUS.RESOURCE_NOT_FOUND.description;
            res.send(output);
            return;
        }

        //查找是否已投票
        const existVote = await sqldb.Like.findOne({
            where: {
                u_id: userInfo.id,
                object_id: demandId,
                type: LIKE_TYPE_DEMAND,
                status: 1
            }
        });

        let voted = true;
        if (existVote) {
            //已投票则取消
            await sqldb.Like.update(
                { status: 0, time: new Date().toLocaleString() },
                { where: { id: existVote.id } }
            );
            voted = false;
        } else {
            await sqldb.Like.create({
                u_id: userInfo.id,
                object_id: demandId,
                type: LIKE_TYPE_DEMAND,
                time: new Date().toLocaleString(),
                status: 1
            });
        }

        //重新统计投票数并回写到需求表
        const voteCount = await sqldb.Like.count({
            where: {
                object_id: demandId,
                type: LIKE_TYPE_DEMAND,
                status: 1
            }
        });

        await sqldb.FeedbackDemand.update(
            { vote: voteCount, update_time: new Date().toLocaleString() },
            { where: { id: demandId } }
        );

        output.success = statusCode.SERVICE_STATUS.VOTE_FEEDBACK_SUCCESS.success;
        output.status = statusCode.SERVICE_STATUS.VOTE_FEEDBACK_SUCCESS.status;
        output.description = voted ? '投票成功' : '已取消投票';
        output.data.voted = voted;
        output.data.vote = voteCount;
    } catch (error) {
        console.log(error);
        output.success = statusCode.SERVICE_STATUS.VOTE_FEEDBACK_FAIL.success;
        output.status = statusCode.SERVICE_STATUS.VOTE_FEEDBACK_FAIL.status;
        output.description = statusCode.SERVICE_STATUS.VOTE_FEEDBACK_FAIL.description;
    }

    logger.info('end vote feedback demand')

    res.send(output);
    return;
});

module.exports = router;
