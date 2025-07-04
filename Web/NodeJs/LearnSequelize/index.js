'use strict'

const config = require('config')
const Sequelize = require('sequelize');

const employee = require('./models/employee.js')
const department = require('./models/department.js')


department.hasMany('employee',{
    foreignKey:'department_id',
    sourceKey:'id'
})

employee.belongsTo(department);
