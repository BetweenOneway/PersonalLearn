'use strict'

const config = require('config')
const Sequelize = require('sequelize');

const user = require('../models/user.js')
const userLog = require('../models/userLog.js')
const memo = require('../models/memo.js')
const operLog = require('../models/operLog.js')
const note = require('../models/note.js')

var dbSettings = config.get("mysql");

var db = {
    sequelize:new Sequelize(dbSettings.database,dbSettings.username,dbSettings.password,dbSettings.sequelize)
};

db.User = user(db.sequelize,Sequelize.DataTypes);
db.UserLog = userLog(db.sequelize,Sequelize.DataTypes);
db.Memo = memo(db.sequelize,Sequelize.DataTypes);
db.Note = note(db.sequelize,Sequelize.DataTypes);
db.operLog = operLog(db.sequelize,Sequelize.DataTypes);

db.User.hasOne(db.Note,
    {
        foreignKey:'u_id',
        sourceKey:'id'
    }
);

module.exports = db;