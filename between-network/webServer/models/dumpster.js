'use strict'

module.exports = function(sequelize,DataTypes){
    var Dumpster = sequelize.define('dumpster',{
        id:{
            type:DataTypes.BIGINT,
            primaryKey:true,
            allowNull:false,
            autoIncrement:true
        },
        u_id:{
            type:DataTypes.BIGINT
        },
        object_id:{
            type:DataTypes.BIGINT
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