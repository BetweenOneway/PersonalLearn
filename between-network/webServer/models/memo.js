const Sequelize = require('sequelize')
'use strict'
module.exports = function(sequelize,DataTypes){
    var User = sequelize.define('memo',{
        id:{
            type:DataTypes.BIGINT,
            primaryKey:true,
            allowNull:false,
        },
        title:{
            type:DataTypes.STRING
        },
        tags:{
            type:DataTypes.STRING
        },
        content:{
            type:DataTypes.TEXT('long')
        },
        u_id:{
            type:DataTypes.BIGINT
        },
        finished:{
            type:DataTypes.INTEGER,
            defaultValue:0
        },
        time:{
            type:DataTypes.DATE
        },
        update_time:{
            type:DataTypes.DATE
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
    return User;
};