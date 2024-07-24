const { Op } = require("sequelize");
let statusCode = require("./statusCode");
//数据库
var sqldb = require('../sqldb');

async function AddEventLog(userId,noteId,event,transaction)
{
    try {
        const newAddedLog = await sqldb.NoteMemoLog.create(
            {
                time: date,
                event: event.code,
                desc:event.desc,
                u_id:userId,
                t_id:noteId
            }, 
            { 
                transaction: transaction 
            }
        )
    } catch (error) {
        console.log("Add event log failed:",event.desc)
        throw new Error("Add log failed")
    }
}

module.exports.AddEventLog = AddEventLog