'use strict'

const config = require('config')
const Sequelize = require('sequelize');

const user = require('../models/user.js')
const userLog = require('../models/userLog.js')
const memo = require('../models/memo.js')
const noteMemoLog = require('../models/noteMemoLog.js')

var dbSettings = config.get("mysql");

var db = {
    sequelize:new Sequelize(dbSettings.database,dbSettings.username,dbSettings.password,dbSettings.sequelize)
};
console.log(db.sequelize)

db.User = user(db.sequelize,Sequelize.DataTypes);
db.UserLog = userLog(db.sequelize,Sequelize.DataTypes);
db.Memo = memo(db.sequelize,Sequelize.DataTypes);
db.NoteMemoLog = noteMemoLog(db.sequelize,Sequelize.DataTypes);

module.exports = db;