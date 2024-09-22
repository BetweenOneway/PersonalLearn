const Sequelize = require('sequelize')
'use strict'
module.exports = function(sequelize,DataTypes){
    var User = sequelize.define('z_oper_log',{
        id:{
            type:DataTypes.INTEGER,
            primaryKey:true,
            allowNull:false,
            autoIncrement:true
        },
        time:{
            type:DataTypes.DATE
        },
        event:{
            type:DataTypes.STRING
        },
        desc:{
            type:DataTypes.STRING
        },
        u_id:{
            type:DataTypes.INTEGER
        },
        o_id:{
            type:DataTypes.INTEGER
        },
        type:{
            type:DataTypes.INTEGER
        }
    },{
        freezeTableName: true,
        timestamps: false
    });
    return User;
};