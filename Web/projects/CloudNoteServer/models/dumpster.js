'use strict'

module.exports = function(sequelize,DataTypes){
    var User = sequelize.define('file_dumpster',{
        id:{
            type:DataTypes.INTEGER,
            // primaryKey:true,
            // allowNull:false,
            // autoIncrement:true
        },
        title:{
            type:DataTypes.STRING
        },
        update_time:{
            type:DataTypes.DATE
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