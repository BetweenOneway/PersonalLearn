const Sequelize = require('sequelize')
'use strict'

/**
 * 用户提交的需求表
 * 对应前端「用户反馈 - 需求进度」
 */
module.exports = function(sequelize,DataTypes){
    const FeedbackDemand = sequelize.define('feedback_demand',{
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
            comment:'需求正文'
        },
        contact:{
            type:DataTypes.STRING(64),
            comment:'联系方式（邮箱 / 手机号），选填'
        },
        step:{
            type:DataTypes.INTEGER,
            defaultValue:0,
            comment:'流转步骤【0：需求提交，1：需求评审，2：需求排期，3：需求研发，4：需求发布】'
        },
        progress:{
            type:DataTypes.INTEGER,
            defaultValue:0,
            comment:'整体进度百分比【0-100】'
        },
        vote:{
            type:DataTypes.INTEGER,
            defaultValue:0,
            comment:'期待人数'
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
                name: 'idx_feedback_demand_user_time'
            },
            {
                fields: ['step', 'time'],
                name: 'idx_feedback_demand_step_time'
            },
            {
                fields: ['status', 'time'],
                name: 'idx_feedback_demand_status_time'
            }
        ]
    });

    FeedbackDemand.associate = models => {
        FeedbackDemand.belongsTo(models.User,
            {
                foreignKey: 'u_id',
                targetKey:'id',
                as:'User'
            }
        );
    }
    return FeedbackDemand;
};
