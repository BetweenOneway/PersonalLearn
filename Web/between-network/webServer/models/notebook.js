const Sequelize = require('sequelize')
'use strict'

module.exports = function(sequelize,DataTypes){
    var Notebook = sequelize.define('notebook',{
        id:{
            type:DataTypes.INTEGER,
            primaryKey:true,
            allowNull:false,
            autoIncrement:true
        },
        name:{
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
        level:{
            type:DataTypes.INTEGER,
            defaultValue:0
        },
        parent_id:{
            type:DataTypes.INTEGER,
            defaultValue:1
        },
        status:{
            type:DataTypes.INTEGER,
        },
    },{
        freezeTableName: true,
        timestamps: false
    });
    return Notebook;
};