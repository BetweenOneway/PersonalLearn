const Sequelize = require('sequelize')
'use strict'

module.exports = function(sequelize,DataTypes){
    const Favorite = sequelize.define('collect',{
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
                name: 'uk_user_object_type'
            },
            {
                fields: ['u_id', 'time'],
                name: 'idx_favorite_user_time'
            },
            {
                fields: ['object_id', 'type'],
                name: 'idx_favorite_object'
            }
        ]
    });

    Favorite.associate = models => {
        Favorite.belongsTo(models.User,
            {
                foreignKey: 'u_id',
                targetKey:'id',
                as:'User'
            }
        );
    }
    return Favorite;
};