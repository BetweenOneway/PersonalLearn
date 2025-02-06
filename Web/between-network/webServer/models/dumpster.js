'use strict'

module.exports = function(sequelize,DataTypes){
    var Dumpster = sequelize.define('dumpster',{
        id:{
            type:DataTypes.INTEGER,
            primaryKey:true,
        },
        u_id:{
            type:DataTypes.INTEGER
        },
        object_id:{
            type:DataTypes.INTEGER
        },
        name:{
            type:DataTypes.STRING
        },
        type:{
            type:DataTypes.INTEGER
        },
        related:{
            type:DataTypes.STRING
        },
        time:{
            type:DataTypes.DATE
        },
    },{
        freezeTableName: true,
        timestamps: false
    });
    return Dumpster;
};