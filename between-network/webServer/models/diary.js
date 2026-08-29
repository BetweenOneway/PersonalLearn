const Sequelize = require('sequelize')
'use strict'
module.exports = function(sequelize,DataTypes){
    const Diary = sequelize.define('diary',{
        id:{
            type:DataTypes.BIGINT,
            primaryKey:true,
            allowNull:false,
        },
        //所属日期（yyyy-MM-dd），与 u_id 共同唯一确定一篇日记
        diary_date:{
            type:DataTypes.DATEONLY,
            allowNull:false
        },
        content:{
            type:DataTypes.TEXT('long')
        },
        u_id:{
            type:DataTypes.BIGINT,
            allowNull:false,
            references: {
                model: 'user',
                key: 'id'
            }
        },
        create_time:{
            type:DataTypes.DATE
        },
        update_time:{
            type:DataTypes.DATE
        },
        //状态【0：被删除，1：正常】
        status:{
            type:DataTypes.INTEGER,
            defaultValue:1
        },
        type:{
            type:DataTypes.INTEGER,
            defaultValue:3
        },
    },{
        freezeTableName: true,
        timestamps: false,
        indexes:[
            {
                name:'diary_user_date_uk',
                unique:true,
                fields:['u_id','diary_date']
            }
        ]
    });

    Diary.associate = models => {
        Diary.belongsTo(models.User,
            {
                foreignKey: 'u_id',
                targetKey:'id',
                as:'User'
            }
        );
    }
    return Diary;
};
