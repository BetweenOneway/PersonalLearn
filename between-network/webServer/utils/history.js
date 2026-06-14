
/**
 * 记录用户操作记录
 * @param {Object} event 事件
 * @param {Integer} objectId 操作对象对象编号
 * @param {Integer} OperUserId 执行操作的用户编号
 * @param {Integer} typeId 对象类型
 */
async function AddOperLogIntoDatabase(event,objectId,OperUserId,typeId)
{
    var curDate = new Date().toLocaleString();

    const t = await sqldb.sequelize.transaction();
    try {
        const addLog = await sqldb.operLog.create(
            {
                time:curDate,
                event:event.code,
                desc:event.desc,
                u_id:OperUserId,
                o_id:objectId,
                type:typeId
            },
            {
                transaction:t
            }
        );
        t.commit();
    } catch (error) {
        logger.info(`add oper log error${JSON.stringify(error)}`);
        t.rollback();
    }
}

module.exports.AddOperHistory = AddOperLogIntoDatabase;