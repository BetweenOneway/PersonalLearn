const Sequelize = require('sequelize')
'use strict'
module.exports = function(sequelize,DataTypes){
    var User = sequelize.define('z_user',{
        id:{
            type:DataTypes.INTEGER,
            primaryKey:true,
            allowNull:false,
            autoIncrement:true
        },
        email:{
            type:DataTypes.STRING,
            unique: true
        },
        password:{
            type:DataTypes.STRING
        },
        nickname:{
            type:DataTypes.STRING,
            defaultValue:""
        },
        head_pic:{
            type:DataTypes.STRING(1000),
            defaultValue:""
        },
        level:{
            type:DataTypes.INTEGER,
            defaultValue:0
        },
        time:{
            type:DataTypes.DATE
        },
        status:{
            type:DataTypes.INTEGER,
            defaultValue:1
        }
    },{
        freezeTableName: true,
        timestamps: false
    });
    return User;
};