const Sequelize = require('sequelize')
'use strict'

module.exports = function(sequelize,DataTypes){
    const Comment = sequelize.define('comment',{
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
        object_id:{
            type:DataTypes.BIGINT
        },
        type:{
            type:DataTypes.INTEGER,
            defaultValue:1
        },
        content:{
            type:DataTypes.STRING(1000)
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
                fields: ['object_id', 'type', 'time'],
                name: 'idx_comment_object_time'
            },
            {
                fields: ['u_id', 'time'],
                name: 'idx_comment_user_time'
            }
        ]
    });

    Comment.associate = models => {
        Comment.belongsTo(models.User,
            {
                foreignKey: 'u_id',
                targetKey:'id',
                as:'User'
            }
        );
    }
    return Comment;
};