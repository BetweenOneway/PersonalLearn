const Sequelize = require('sequelize')
'use strict'

module.exports = function(sequelize,DataTypes){
    const Subscribe = sequelize.define('subscribe',{
        id:{
            type:DataTypes.BIGINT,
            primaryKey:true,
            allowNull:false,
            autoIncrement:true
        },
        u_id:{
            type:DataTypes.BIGINT,
            references: {
                model: 'user',
                key: 'id'
            }
        },
        // 被关注作者(用户)的编号
        object_id:{
            type:DataTypes.BIGINT
        },
        // 订阅类型【1：关注作者】
        type:{
            type:DataTypes.INTEGER,
            defaultValue:1
        },
        time:{
            type:DataTypes.DATE
        },
        // 状态【0：已取消，1：订阅中】
        status:{
            type:DataTypes.INTEGER,
            defaultValue:1
        },
    },{
        freezeTableName: true,
        timestamps: false,
        indexes: [
            {
                unique: true,
                fields: ['u_id', 'object_id', 'type'],
                name: 'uk_subscribe_user_object_type'
            },
            {
                fields: ['object_id', 'type'],
                name: 'idx_subscribe_object'
            },
            {
                fields: ['u_id', 'time'],
                name: 'idx_subscribe_user_time'
            }
        ]
    });

    Subscribe.associate = models => {
        Subscribe.belongsTo(models.User,
            {
                foreignKey: 'u_id',
                targetKey:'id',
                as:'User'
            }
        );
    }
    return Subscribe;
};
