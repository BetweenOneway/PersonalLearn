const Sequelize = require('sequelize')
'use strict'
const User = require('../models/user.js')
module.exports = function(sequelize,DataTypes){
    const Note = sequelize.define('z_note',{
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
            type:DataTypes.INTEGER,
            references: {
                model: 'z_user',
                key: 'id'
            }
        },
        notebook_id:{
            type:DataTypes.INTEGER, 
            references: {
                model: 'notebook',
                key: 'id'
            }
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

    Note.associate = models => {
        Note.belongsTo(models.User,
            {
                foreignKey: 'u_id',
                targetKey:'id'
            }
        );
        Note.belongsTo(models.Notebook,
            {
                foreignKey: 'notebook_id',
                targetKey:'id'
            }
        )
    }
    return Note;
};