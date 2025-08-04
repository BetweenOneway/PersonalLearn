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
        },
        sex:{
            type:DataTypes.INTEGER,
            defaultValue:1
        },
        birthday:{
            type:DataTypes.DATE
        }
    },{
        freezeTableName: true,
        timestamps: false
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