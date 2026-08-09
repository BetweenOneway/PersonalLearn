const Sequelize = require('sequelize')
'use strict'
module.exports = function(sequelize,DataTypes){
    var User = sequelize.define('user',{
        id:{
            type:DataTypes.BIGINT,
            primaryKey:true,
            allowNull:false,
        },
        email:{
            type:DataTypes.STRING,
            unique: 'UK_USER_EMAIL'
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
        },
        sex:{
            type:DataTypes.INTEGER,
            defaultValue:1
        },
        birthday:{
            type:DataTypes.DATE,
            defaultValue: '1949-10-01'
        },
        role:{
            type:DataTypes.INTEGER,
            defaultValue:0,
            comment:'用户角色【0：普通用户，1：网站管理员】'
        }
    },{
        freezeTableName: true,
        timestamps: false,
        // indexes:[
        //     {
        //         fields:['email'],
        //         // unique:true,
        //     },
        // ],
    });

    User.associate = models => {
        User.hasMany(models.Note,
            {
                foreignKey: 'u_id',
                sourceKey:'id',
                as:'Note'
            }
        );

        User.hasMany(models.Notebook,
            {
                foreignKey: 'u_id',
                sourceKey:'id',
                as:'Notebook'
            }
        );
    }

    return User;
};