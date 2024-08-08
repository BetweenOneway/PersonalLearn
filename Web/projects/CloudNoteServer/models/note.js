const Sequelize = require('sequelize')
'use strict'
const User = require('../models/user.js')
module.exports = function(sequelize,DataTypes){
    var Note = sequelize.define('z_note',{
        id:{
            type:DataTypes.INTEGER,
            primaryKey:true,
            allowNull:false,
            autoIncrement:true
        },
        title:{
            type:DataTypes.STRING
        },
        body:{
            type:DataTypes.STRING
        },
        content:{
            type:DataTypes.STRING
        },
        time:{
            type:DataTypes.DATE
        },
        update_time:{
            type:DataTypes.DATE
        },
        u_id:{
            type:DataTypes.INTEGER
        },
        top:{
            type:DataTypes.INTEGER,
            defaultValue:0
        },
        status:{
            type:DataTypes.INTEGER,
            defaultValue:1
        },
        type:{
            type:DataTypes.INTEGER,
            defaultValue:2
        },
    },{
        freezeTableName: true,
        timestamps: false
    });
    return Note;
};