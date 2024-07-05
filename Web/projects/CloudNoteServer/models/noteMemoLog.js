const Sequelize = require('sequelize')
'use strict'
module.exports = function(sequelize,DataTypes){
    var User = sequelize.define('z_note_memo_log',{
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
        n_id:{
            type:DataTypes.INTEGER
        },
        t_id:{
            type:DataTypes.INTEGER
        }
    },{
        freezeTableName: true,
        timestamps: false
    });
    return User;
};