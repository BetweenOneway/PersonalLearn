'use strict'

const config = require('config')
const Sequelize = require('sequelize');

const user = require('../models/user.js')

var dbSettings = config.get("mysql");

var db = {
    sequelize:new Sequelize(dbSettings.database,dbSettings.username,dbSettings.password,dbSettings.sequelize)
};
console.log(db.sequelize)

db.User = user(db.sequelize,Sequelize.DataTypes);
module.exports = db;