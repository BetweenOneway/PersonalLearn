const Sequelize = require('sequelize')
'use strict'

/**
 * 用户提交的问题表
 * 对应前端「用户反馈 - 问题反应」
 */
module.exports = function(sequelize,DataTypes){
    const FeedbackIssue = sequelize.define('feedback_issue',{
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
            },
            comment:'提交人编号（雪花ID）'
        },
        content:{
            type:DataTypes.TEXT('long'),
            charset: 'utf8mb4',
            collate: 'utf8mb4_general_ci',
            comment:'问题描述'
        },
        contact:{
            type:DataTypes.STRING(64),
            comment:'联系方式（邮箱 / 手机号），选填'
        },
        level:{
            type:DataTypes.INTEGER,
            defaultValue:1,
            comment:'严重程度【1：轻微，2：一般，3：严重】'
        },
        handle_status:{
            type:DataTypes.INTEGER,
            defaultValue:0,
            comment:'处理状态【0：待确认，1：处理中，2：待验证，3：已修复】'
        },
        handle_desc:{
            type:DataTypes.STRING(1000),
            charset: 'utf8mb4',
            collate: 'utf8mb4_general_ci',
            comment:'处理说明'
        },
        time:{
            type:DataTypes.DATE,
            comment:'提交时间'
        },
        update_time:{
            type:DataTypes.DATE,
            comment:'最后更新时间'
        },
        status:{
            type:DataTypes.INTEGER,
            defaultValue:1,
            comment:'状态【0：已删除，1：正常】'
        },
    },{
        freezeTableName: true,
        timestamps: false,
        indexes: [
            {
                fields: ['u_id', 'time'],
                name: 'idx_feedback_issue_user_time'
            },
            {
                fields: ['handle_status', 'time'],
                name: 'idx_feedback_issue_handle_time'
            },
            {
                fields: ['status', 'time'],
                name: 'idx_feedback_issue_status_time'
            }
        ]
    });

    FeedbackIssue.associate = models => {
        FeedbackIssue.belongsTo(models.User,
            {
                foreignKey: 'u_id',
                targetKey:'id',
                as:'User'
            }
        );
    }
    return FeedbackIssue;
};
