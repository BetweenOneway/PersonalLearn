const Sequelize = require('sequelize')
'use strict'
module.exports = function(sequelize,DataTypes){
    const Todo = sequelize.define('todo',{
        id:{
            type:DataTypes.BIGINT,
            primaryKey:true,
            allowNull:false,
        },
        //待办所属日期（yyyy-MM-dd），与 u_id 共同唯一确定一天的待办
        todo_date:{
            type:DataTypes.DATEONLY,
            allowNull:false
        },
        //当天完整的待办树，以 JSON 字符串形式存储
        //结构：[{id,text,done,children:[...]}]
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
            defaultValue:4
        },
    },{
        freezeTableName: true,
        timestamps: false,
        indexes:[
            {
                name:'todo_user_date_uk',
                unique:true,
                fields:['u_id','todo_date']
            }
        ]
    });

    Todo.associate = models => {
        Todo.belongsTo(models.User,
            {
                foreignKey: 'u_id',
                targetKey:'id',
                as:'User'
            }
        );
    }
    return Todo;
};
