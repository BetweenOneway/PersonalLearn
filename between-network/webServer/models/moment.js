const Sequelize = require('sequelize')
'use strict'

module.exports = function(sequelize,DataTypes){
    const Moment = sequelize.define('moment',{
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
        content:{
            type:DataTypes.TEXT
        },
        images:{
            type:DataTypes.STRING(2000),
            comment: '说说配图，多个以英文逗号分隔'
        },
        time:{
            type:DataTypes.DATE
        },
        status:{
            type:DataTypes.INTEGER,
            defaultValue:1,
            comment: '状态【0：已删除，1：正常】'
        }
    },{
        freezeTableName: true,
        timestamps: false,
        indexes: [
            {
                fields: ['u_id', 'time'],
                name: 'idx_moment_user_time'
            }
        ]
    });

    Moment.associate = models => {
        Moment.belongsTo(models.User,
            {
                foreignKey: 'u_id',
                targetKey:'id',
                as:'User'
            }
        );
    }
    return Moment;
};
