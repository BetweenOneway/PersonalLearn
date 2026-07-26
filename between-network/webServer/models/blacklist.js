const Sequelize = require('sequelize')
'use strict'

module.exports = function(sequelize,DataTypes){
    const Blacklist = sequelize.define('blacklist',{
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
        target_u_id:{
            type:DataTypes.INTEGER,
            references: {
                model: 'user',
                key: 'id'
            }
        },
        reason:{
            type:DataTypes.STRING(500)
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
                fields: ['u_id', 'target_u_id'],
                name: 'uk_blacklist_user_target'
            },
            {
                fields: ['target_u_id'],
                name: 'idx_blacklist_target'
            }
        ]
    });

    Blacklist.associate = models => {
        Blacklist.belongsTo(models.User,
            {
                foreignKey: 'u_id',
                targetKey:'id',
                as:'User'
            }
        );
        Blacklist.belongsTo(models.User,
            {
                foreignKey: 'target_u_id',
                targetKey:'id',
                as:'TargetUser'
            }
        );
    }
    return Blacklist;
};