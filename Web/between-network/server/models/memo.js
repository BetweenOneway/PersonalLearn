const Sequelize = require('sequelize')
'use strict'
module.exports = function(sequelize,DataTypes){
    var User = sequelize.define('z_memo',{
        id:{
            type:DataTypes.INTEGER,
            primaryKey:true,
            allowNull:false,
            autoIncrement:true
        },
        title:{
            type:DataTypes.STRING
        },
        tags:{
            type:DataTypes.STRING
        },
        content:{
            type:DataTypes.STRING
        },
        u_id:{
            type:DataTypes.INTEGER
        },
        finished:{
            type:DataTypes.INTEGER,
            defaultValue:1
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