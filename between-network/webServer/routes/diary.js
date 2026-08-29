const express = require("express");
const { Op } = require("sequelize");

//数据库
var sqldb = require('../sqldb');
let statusCode = require("./statusCode")
const { nextId } = require("../utils/snowflake");

var router = express.Router();

//被删除状态
const DELETED_STATUS = 0;
//正常状态
const NORMAL_STATUS = 1;
//待办最大嵌套层级
const MAX_TODO_LEVEL = 5;

/**
 * 校验日期字符串格式是否为 yyyy-MM-dd
 * @param {string} dateStr 日期字符串
 * @returns {boolean} 格式合法返回 true
 */
function isValidDate(dateStr) {
    if (typeof dateStr !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
        return false;
    }
    const date = new Date(`${dateStr}T00:00:00`);
    if (Number.isNaN(date.getTime())) {
        return false;
    }
    //排除 2023-02-31 这类看似合法但会被自动进位的日期
    const [year, month, day] = dateStr.split('-').map(Number);
    return date.getFullYear() === year
        && date.getMonth() + 1 === month
        && date.getDate() === day;
}

/**
 * 规整前端提交的待办树，用于写库前的清洗
 * 丢弃内容为空的节点、补齐缺失的编号、剔除多余字段，并限制嵌套层级
 * @param {Array} todoTree 前端提交的待办树
 * @param {number} level 当前层级，顶层为 0
 * @returns {Array} 规整后的待办树，仅含 id/text/done/children 字段
 */
function normalizeTodoTree(todoTree, level) {
    if (!Array.isArray(todoTree) || level > MAX_TODO_LEVEL) {
        return [];
    }

    const result = [];
    todoTree.forEach((item) => {
        if (!item || typeof item !== 'object') {
            return;
        }

        //文本为空的待办直接丢弃，同时其子待办也不再保留
        let text = typeof item.text === 'string' ? item.text.trim() : '';
        if (text.length === 0) {
            return;
        }
        if (text.length > 1024) {
            text = text.substring(0, 1024);
        }

        result.push({
            //复用前端回传的编号，保证多次保存时编号稳定
            id: item.id ? String(item.id) : String(nextId()),
            text: text,
            done: item.done === true || item.done === 1,
            children: normalizeTodoTree(item.children, level + 1)
        });
    });

    return result;
}

/**
 * 解析数据库中存储的待办 JSON 字符串
 * 兼容脏数据：解析失败或结构不是数组时返回空数组，避免影响整个接口
 * @param {string} content 待办 JSON 字符串
 * @returns {Array} 待办树
 */
function parseTodoContent(content) {
    if (!content) {
        return [];
    }

    try {
        const parsed = JSON.parse(content);
        return Array.isArray(parsed) ? parsed : [];
    } catch (error) {
        logger.info(`parseTodoContent error:${error}`)
        return [];
    }
}

/**
 * 在待办树中递归移除指定编号的节点（其子待办随之一并移除）
 * @param {Array} todoTree 待办树
 * @param {string} todoId 待移除的待办编号
 * @returns {boolean} 命中并移除返回 true
 */
function removeTodoById(todoTree, todoId) {
    if (!Array.isArray(todoTree)) {
        return false;
    }

    for (let i = 0; i < todoTree.length; i++) {
        const item = todoTree[i];
        if (!item || typeof item !== 'object') {
            continue;
        }

        if (String(item.id) === String(todoId)) {
            todoTree.splice(i, 1);
            return true;
        }

        if (removeTodoById(item.children, todoId)) {
            return true;
        }
    }

    return false;
}

/**
 * 获取指定日期的日记与待办事项
 * date 日期（yyyy-MM-dd）
 * userToken 用户信息
 */
router.get("/getDiary", async (req, res) => {
    let output = {
        success: false,
        status: '',
        description: '',
        data: {
            date: '',
            content: '',
            todos: [],
            update_time: ''
        }
    }

    let date = req.query.date;
    logger.info(`start getDiary,date:${date}`)

    if (!isValidDate(date)) {
        logger.info(`getDiary param error,date:${date}`)
        output.success = statusCode.SERVICE_STATUS.PARAM_ERROR.success
        output.status = statusCode.SERVICE_STATUS.PARAM_ERROR.status
        output.description = statusCode.SERVICE_STATUS.PARAM_ERROR.description
        res.send(output);
        return;
    }

    try {
        let userInfo = req.userInfo;

        //日记与待办分表存储，一次请求同时返回
        const [diary, todo] = await Promise.all([
            sqldb.Diary.findOne({
                attributes: ['id', 'content', 'update_time'],
                where: {
                    u_id: userInfo.id,
                    diary_date: date,
                    status: {
                        [Op.ne]: DELETED_STATUS,
                    },
                },
                raw: true,
            }),
            sqldb.Todo.findOne({
                attributes: ['id', 'content', 'update_time'],
                where: {
                    u_id: userInfo.id,
                    todo_date: date,
                    status: {
                        [Op.ne]: DELETED_STATUS,
                    },
                },
                raw: true,
            })
        ]);

        output.data.date = date;
        output.data.content = diary ? (diary.content || '') : '';
        output.data.update_time = diary ? diary.update_time : '';
        //待办以 JSON 字符串存库，读取时解析为树形返回给前端
        output.data.todos = todo ? parseTodoContent(todo.content) : [];

        output.success = statusCode.SERVICE_STATUS.GET_DIARY_SUCCESS.success
        output.status = statusCode.SERVICE_STATUS.GET_DIARY_SUCCESS.status
        output.description = statusCode.SERVICE_STATUS.GET_DIARY_SUCCESS.description
    } catch (error) {
        logger.info(`getDiary error:${error}`)
        output.success = statusCode.SERVICE_STATUS.GET_DIARY_FAIL.success
        output.status = statusCode.SERVICE_STATUS.GET_DIARY_FAIL.status
        output.description = statusCode.SERVICE_STATUS.GET_DIARY_FAIL.description
    }

    res.send(output);
    logger.info(`End of getDiary`)
    return;
})

/**
 * 获取指定月份内已存在日记或待办的日期列表，用于日历标记
 * month 月份（yyyy-MM）
 * userToken 用户信息
 */
router.get("/getDiaryDateList", async (req, res) => {
    let output = {
        success: false,
        status: '',
        description: '',
        data: {
            dates: []
        }
    }

    let month = req.query.month;
    logger.info(`start getDiaryDateList,month:${month}`)

    if (typeof month !== 'string' || !/^\d{4}-\d{2}$/.test(month)) {
        logger.info(`getDiaryDateList param error,month:${month}`)
        output.success = statusCode.SERVICE_STATUS.PARAM_ERROR.success
        output.status = statusCode.SERVICE_STATUS.PARAM_ERROR.status
        output.description = statusCode.SERVICE_STATUS.PARAM_ERROR.description
        res.send(output);
        return;
    }

    try {
        let userInfo = req.userInfo;

        //计算该月的起止日期（含首尾）
        const [year, monthIndex] = month.split('-').map(Number);
        const startDate = `${month}-01`;
        //new Date(year, monthIndex, 0) 得到该月最后一天
        const lastDay = new Date(year, monthIndex, 0).getDate();
        const endDate = `${month}-${String(lastDay).padStart(2, '0')}`;

        const dateRange = {
            [Op.between]: [startDate, endDate]
        };

        const [diaryDates, todoDates] = await Promise.all([
            sqldb.Diary.findAll({
                attributes: ['diary_date'],
                where: {
                    u_id: userInfo.id,
                    diary_date: dateRange,
                    status: {
                        [Op.ne]: DELETED_STATUS,
                    },
                },
                raw: true,
            }),
            sqldb.Todo.findAll({
                //每个用户每天仅一条待办记录，无需去重
                attributes: ['todo_date'],
                where: {
                    u_id: userInfo.id,
                    todo_date: dateRange,
                    status: {
                        [Op.ne]: DELETED_STATUS,
                    },
                },
                raw: true,
            })
        ]);

        //日记与待办的日期合并去重
        const dateSet = new Set();
        diaryDates.forEach((item) => dateSet.add(item.diary_date));
        todoDates.forEach((item) => dateSet.add(item.todo_date));

        output.data.dates = Array.from(dateSet).sort();
        output.success = statusCode.SERVICE_STATUS.GET_DIARY_DATE_LIST_SUCCESS.success
        output.status = statusCode.SERVICE_STATUS.GET_DIARY_DATE_LIST_SUCCESS.status
        output.description = statusCode.SERVICE_STATUS.GET_DIARY_DATE_LIST_SUCCESS.description
    } catch (error) {
        logger.info(`getDiaryDateList error:${error}`)
        output.success = statusCode.SERVICE_STATUS.GET_DIARY_DATE_LIST_FAIL.success
        output.status = statusCode.SERVICE_STATUS.GET_DIARY_DATE_LIST_FAIL.status
        output.description = statusCode.SERVICE_STATUS.GET_DIARY_DATE_LIST_FAIL.description
    }

    res.send(output);
    logger.info(`End of getDiaryDateList`)
    return;
})

/**
 * 保存指定日期的日记内容（不存在则新建，存在则更新）
 * date 日期（yyyy-MM-dd）
 * content 日记内容
 * userToken 用户信息
 */
router.post("/saveDiary", async (req, res) => {
    let output = {
        success: false,
        status: '',
        description: '',
        data: {
            diaryId: '',
            update_time: ''
        }
    }

    let date = req.body.date;
    let content = typeof req.body.content === 'string' ? req.body.content : '';

    logger.info(`start saveDiary,date:${date}`)

    if (!isValidDate(date)) {
        logger.info(`saveDiary param error,date:${date}`)
        output.success = statusCode.SERVICE_STATUS.PARAM_ERROR.success
        output.status = statusCode.SERVICE_STATUS.PARAM_ERROR.status
        output.description = statusCode.SERVICE_STATUS.PARAM_ERROR.description
        res.send(output);
        return;
    }

    const t = await sqldb.sequelize.transaction();

    try {
        let userInfo = req.userInfo;
        let curTime = new Date().toLocaleString();

        const targetDiary = await sqldb.Diary.findOne({
            where: {
                u_id: userInfo.id,
                diary_date: date,
            },
            transaction: t
        });

        let diaryId = '';
        if (targetDiary) {
            //已存在则更新内容，同时把之前被删除的日记恢复为正常状态
            diaryId = String(targetDiary.id);
            await sqldb.Diary.update(
                {
                    content: content,
                    update_time: curTime,
                    status: NORMAL_STATUS,
                },
                {
                    where: {
                        id: targetDiary.id,
                        u_id: userInfo.id,
                    },
                    transaction: t
                }
            );
        } else {
            const newDiary = await sqldb.Diary.create(
                {
                    id: nextId(),
                    diary_date: date,
                    content: content,
                    u_id: userInfo.id,
                    create_time: curTime,
                    update_time: curTime,
                    status: NORMAL_STATUS,
                    type: 3
                },
                {
                    transaction: t
                }
            );
            diaryId = String(newDiary.id);
        }

        //记录操作日志
        let event = statusCode.EVENT_LIST.SAVE_DIARY;
        await sqldb.operLog.create(
            {
                time: curTime,
                event: event.code,
                desc: event.desc,
                u_id: userInfo.id,
                o_id: diaryId,
                type: 1
            },
            {
                transaction: t
            }
        );

        await t.commit();
        logger.info(`saveDiary success,diaryId:${diaryId}`)

        output.data.diaryId = diaryId;
        output.data.update_time = curTime;
        output.success = statusCode.SERVICE_STATUS.SAVE_DIARY_SUCCESS.success
        output.status = statusCode.SERVICE_STATUS.SAVE_DIARY_SUCCESS.status
        output.description = statusCode.SERVICE_STATUS.SAVE_DIARY_SUCCESS.description
    } catch (error) {
        logger.info(`saveDiary error:${error}`)
        await t.rollback();
        output.success = statusCode.SERVICE_STATUS.SAVE_DIARY_FAIL.success
        output.status = statusCode.SERVICE_STATUS.SAVE_DIARY_FAIL.status
        output.description = statusCode.SERVICE_STATUS.SAVE_DIARY_FAIL.description
    }

    res.send(output);
    logger.info(`End of saveDiary`)
    return;
})

/**
 * 删除指定日期的日记（逻辑删除）
 * date 日期（yyyy-MM-dd）
 * userToken 用户信息
 */
router.post("/deleteDiary", async (req, res) => {
    let output = {
        success: false,
        status: '',
        description: '',
        data: {}
    }

    let date = req.body.date;
    logger.info(`start deleteDiary,date:${date}`)

    if (!isValidDate(date)) {
        logger.info(`deleteDiary param error,date:${date}`)
        output.success = statusCode.SERVICE_STATUS.PARAM_ERROR.success
        output.status = statusCode.SERVICE_STATUS.PARAM_ERROR.status
        output.description = statusCode.SERVICE_STATUS.PARAM_ERROR.description
        res.send(output);
        return;
    }

    const t = await sqldb.sequelize.transaction();

    try {
        let userInfo = req.userInfo;
        let curTime = new Date().toLocaleString();

        const updateNum = await sqldb.Diary.update(
            {
                status: DELETED_STATUS,
                update_time: curTime,
            },
            {
                where: {
                    u_id: userInfo.id,
                    diary_date: date,
                    status: {
                        [Op.ne]: DELETED_STATUS,
                    },
                },
                transaction: t
            }
        );

        //记录操作日志
        let event = statusCode.EVENT_LIST.DELETE_DIARY;
        await sqldb.operLog.create(
            {
                time: curTime,
                event: event.code,
                desc: event.desc,
                u_id: userInfo.id,
                o_id: 0,
                type: 1
            },
            {
                transaction: t
            }
        );

        await t.commit();
        logger.info(`deleteDiary success,affected rows:${updateNum}`)

        output.success = statusCode.SERVICE_STATUS.DELETE_DIARY_SUCCESS.success
        output.status = statusCode.SERVICE_STATUS.DELETE_DIARY_SUCCESS.status
        output.description = statusCode.SERVICE_STATUS.DELETE_DIARY_SUCCESS.description
    } catch (error) {
        logger.info(`deleteDiary error:${error}`)
        await t.rollback();
        output.success = statusCode.SERVICE_STATUS.DELETE_DIARY_FAIL.success
        output.status = statusCode.SERVICE_STATUS.DELETE_DIARY_FAIL.status
        output.description = statusCode.SERVICE_STATUS.DELETE_DIARY_FAIL.description
    }

    res.send(output);
    logger.info(`End of deleteDiary`)
    return;
})

/**
 * 保存指定日期的待办事项
 * 整棵待办树序列化为 JSON 字符串，每个用户每天只存一条记录（不存在则新建，存在则更新）
 * date 日期（yyyy-MM-dd）
 * todos 待办树，元素形如 {id,text,done,children}
 * userToken 用户信息
 */
router.post("/saveTodo", async (req, res) => {
    let output = {
        success: false,
        status: '',
        description: '',
        data: {
            todoId: '',
            todos: [],
            update_time: ''
        }
    }

    let date = req.body.date;
    let todos = req.body.todos;

    logger.info(`start saveTodo,date:${date}`)

    if (!isValidDate(date) || !Array.isArray(todos)) {
        logger.info(`saveTodo param error,date:${date}`)
        output.success = statusCode.SERVICE_STATUS.PARAM_ERROR.success
        output.status = statusCode.SERVICE_STATUS.PARAM_ERROR.status
        output.description = statusCode.SERVICE_STATUS.PARAM_ERROR.description
        res.send(output);
        return;
    }

    const t = await sqldb.sequelize.transaction();

    try {
        let userInfo = req.userInfo;
        let curTime = new Date().toLocaleString();

        //清洗待办树并补齐新增节点的编号，再序列化为 JSON 字符串入库
        const normalizedTodos = normalizeTodoTree(todos, 0);
        const content = JSON.stringify(normalizedTodos);

        const targetTodo = await sqldb.Todo.findOne({
            where: {
                u_id: userInfo.id,
                todo_date: date,
            },
            transaction: t
        });

        let todoId = '';
        if (targetTodo) {
            //已存在则整体覆盖，同时把之前被删除的记录恢复为正常状态
            todoId = String(targetTodo.id);
            await sqldb.Todo.update(
                {
                    content: content,
                    update_time: curTime,
                    status: NORMAL_STATUS,
                },
                {
                    where: {
                        id: targetTodo.id,
                        u_id: userInfo.id,
                    },
                    transaction: t
                }
            );
        } else {
            const newTodo = await sqldb.Todo.create(
                {
                    id: nextId(),
                    todo_date: date,
                    content: content,
                    u_id: userInfo.id,
                    create_time: curTime,
                    update_time: curTime,
                    status: NORMAL_STATUS,
                    type: 4
                },
                {
                    transaction: t
                }
            );
            todoId = String(newTodo.id);
        }

        //记录操作日志
        let event = statusCode.EVENT_LIST.SAVE_TODO;
        await sqldb.operLog.create(
            {
                time: curTime,
                event: event.code,
                desc: event.desc,
                u_id: userInfo.id,
                o_id: todoId,
                type: 1
            },
            {
                transaction: t
            }
        );

        await t.commit();
        logger.info(`saveTodo success,todoId:${todoId},top level count:${normalizedTodos.length}`)

        //回传带编号的待办树，便于前端同步新增节点的编号
        output.data.todoId = todoId;
        output.data.todos = normalizedTodos;
        output.data.update_time = curTime;
        output.success = statusCode.SERVICE_STATUS.SAVE_TODO_SUCCESS.success
        output.status = statusCode.SERVICE_STATUS.SAVE_TODO_SUCCESS.status
        output.description = statusCode.SERVICE_STATUS.SAVE_TODO_SUCCESS.description
    } catch (error) {
        logger.info(`saveTodo error:${error}`)
        await t.rollback();
        output.success = statusCode.SERVICE_STATUS.SAVE_TODO_FAIL.success
        output.status = statusCode.SERVICE_STATUS.SAVE_TODO_FAIL.status
        output.description = statusCode.SERVICE_STATUS.SAVE_TODO_FAIL.description
    }

    res.send(output);
    logger.info(`End of saveTodo`)
    return;
})

/**
 * 删除某一天待办树中的单个节点及其所有子待办
 * 待办以整棵树存于一条记录，因此这里读出 JSON、移除目标节点后再写回
 * date 日期（yyyy-MM-dd）
 * todoId 待办节点编号
 * userToken 用户信息
 */
router.post("/deleteTodo", async (req, res) => {
    let output = {
        success: false,
        status: '',
        description: '',
        data: {
            todos: [],
            update_time: ''
        }
    }

    let date = req.body.date;
    let todoId = req.body.todoId;
    logger.info(`start deleteTodo,date:${date},todoId:${todoId}`)

    if (!isValidDate(date) || !todoId) {
        logger.info(`deleteTodo param error,date:${date},todoId:${todoId}`)
        output.success = statusCode.SERVICE_STATUS.PARAM_ERROR.success
        output.status = statusCode.SERVICE_STATUS.PARAM_ERROR.status
        output.description = statusCode.SERVICE_STATUS.PARAM_ERROR.description
        res.send(output);
        return;
    }

    const t = await sqldb.sequelize.transaction();

    try {
        let userInfo = req.userInfo;
        let curTime = new Date().toLocaleString();

        const targetTodo = await sqldb.Todo.findOne({
            attributes: ['id', 'content'],
            where: {
                u_id: userInfo.id,
                todo_date: date,
                status: {
                    [Op.ne]: DELETED_STATUS,
                },
            },
            raw: true,
            transaction: t
        });

        if (!targetTodo) {
            //当天没有待办记录，或记录不属于当前用户
            await t.rollback();
            logger.info(`deleteTodo target not found,date:${date}`)
            output.success = statusCode.SERVICE_STATUS.DELETE_TODO_FAIL.success
            output.status = statusCode.SERVICE_STATUS.DELETE_TODO_FAIL.status
            output.description = statusCode.SERVICE_STATUS.DELETE_TODO_FAIL.description
            res.send(output);
            return;
        }

        const todoTree = parseTodoContent(targetTodo.content);
        const removed = removeTodoById(todoTree, todoId);

        if (!removed) {
            //树中不存在该节点，视为已删除，直接返回当前数据保证前端幂等
            await t.rollback();
            logger.info(`deleteTodo node not found in tree,todoId:${todoId}`)
            output.data.todos = todoTree;
            output.success = statusCode.SERVICE_STATUS.DELETE_TODO_SUCCESS.success
            output.status = statusCode.SERVICE_STATUS.DELETE_TODO_SUCCESS.status
            output.description = statusCode.SERVICE_STATUS.DELETE_TODO_SUCCESS.description
            res.send(output);
            return;
        }

        await sqldb.Todo.update(
            {
                content: JSON.stringify(todoTree),
                update_time: curTime,
            },
            {
                where: {
                    id: targetTodo.id,
                    u_id: userInfo.id,
                },
                transaction: t
            }
        );

        //记录操作日志
        let event = statusCode.EVENT_LIST.DELETE_TODO;
        await sqldb.operLog.create(
            {
                time: curTime,
                event: event.code,
                desc: event.desc,
                u_id: userInfo.id,
                o_id: targetTodo.id,
                type: 1
            },
            {
                transaction: t
            }
        );

        await t.commit();
        logger.info(`deleteTodo success,todoId:${todoId}`)

        //回传删除后的完整待办树，前端可直接覆盖本地数据
        output.data.todos = todoTree;
        output.data.update_time = curTime;
        output.success = statusCode.SERVICE_STATUS.DELETE_TODO_SUCCESS.success
        output.status = statusCode.SERVICE_STATUS.DELETE_TODO_SUCCESS.status
        output.description = statusCode.SERVICE_STATUS.DELETE_TODO_SUCCESS.description
    } catch (error) {
        logger.info(`deleteTodo error:${error}`)
        await t.rollback();
        output.success = statusCode.SERVICE_STATUS.DELETE_TODO_FAIL.success
        output.status = statusCode.SERVICE_STATUS.DELETE_TODO_FAIL.status
        output.description = statusCode.SERVICE_STATUS.DELETE_TODO_FAIL.description
    }

    res.send(output);
    logger.info(`End of deleteTodo`)
    return;
})

module.exports = router;
