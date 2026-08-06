'use strict'

module.exports = function(sequelize,DataTypes){
    var Files = sequelize.define('recent_access_file',{
        id:{
            type:DataTypes.BIGINT,
            primaryKey:true,
        },
        title:{
            type:DataTypes.STRING
        },
        update_time:{
            type:DataTypes.DATE
        },
        type:{
            type:DataTypes.INTEGER,
            primaryKey:true,
            defaultValue:2
        },
        u_id:{
            type:DataTypes.BIGINT
        }
    },{
        freezeTableName: true,
        timestamps: false
    });
    return Files;
};