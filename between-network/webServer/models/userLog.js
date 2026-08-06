const Sequelize = require('sequelize')
'use strict'
module.exports = function(sequelize,DataTypes){
    var User = sequelize.define('user_log',{
        id:{
            type:DataTypes.BIGINT,
            primaryKey:true,
            allowNull:false,
            autoIncrement:true
        },
        desc:{
            type:DataTypes.STRING
        },
        time:{
            type:DataTypes.DATE
        },
        event:{
            type:DataTypes.STRING
        },
        u_id:{
            type:DataTypes.BIGINT
        }
    },{
        freezeTableName: true,
        timestamps: false
    });
    return User;
};