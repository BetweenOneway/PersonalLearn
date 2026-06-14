const Sequelize = require('sequelize')
'use strict'
module.exports = function(sequelize,DataTypes){
    var User = sequelize.define('z_user_log',{
        id:{
            type:DataTypes.INTEGER,
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
            type:DataTypes.INTEGER
        }
    },{
        freezeTableName: true,
        timestamps: false
    });
    return User;
};