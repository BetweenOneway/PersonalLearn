const Sequelize = require('sequelize')
'use strict'

module.exports = function(sequelize,DataTypes){
    const Like = sequelize.define('like',{
        id:{
            type:DataTypes.INTEGER,
            primaryKey:true,
            allowNull:false,
            autoIncrement:true
        },
        u_id:{
            type:DataTypes.INTEGER,
            references: {
                model: 'user',
                key: 'id'
            }
        },
        object_id:{
            type:DataTypes.INTEGER
        },
        type:{
            type:DataTypes.INTEGER,
            defaultValue:1
        },
        time:{
            type:DataTypes.DATE
        },
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
                name: 'uk_like_user_object_type'
            },
            {
                fields: ['object_id', 'type'],
                name: 'idx_like_object'
            },
            {
                fields: ['u_id', 'time'],
                name: 'idx_like_user_time'
            }
        ]
    });

    Like.associate = models => {
        Like.belongsTo(models.User,
            {
                foreignKey: 'u_id',
                targetKey:'id',
                as:'User'
            }
        );
    }
    return Like;
};