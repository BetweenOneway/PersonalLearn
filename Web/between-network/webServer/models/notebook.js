const Sequelize = require('sequelize')
'use strict'

module.exports = function(sequelize,DataTypes){
    var Notebook = sequelize.define('notebook',{
        id:{
            type:DataTypes.INTEGER,
            primaryKey:true,
            allowNull:false,
            autoIncrement:true
        },
        name:{
            type:DataTypes.STRING
        },
        time:{
            type:DataTypes.DATE
        },
        update_time:{
            type:DataTypes.DATE
        },
        u_id:{
            type:DataTypes.INTEGER,
            references: {
                model: 'z_user',
                key: 'id'
            }
        },
        level:{
            type:DataTypes.INTEGER,
            defaultValue:0
        },
        index:{
            type:DataTypes.INTEGER,
            field:'index_in_notebook',
        },
        parent_id:{
            type:DataTypes.INTEGER,
            defaultValue:1
        },
        status:{
            type:DataTypes.INTEGER,
        },
    },{
        freezeTableName: true,
        timestamps: false
    });

    Notebook.associate = models => {
        Notebook.hasMany(models.Note,
            {
                foreignKey: 'notebook_id',
                sourceKey:'id'
            }
        );
        Notebook.belongsTo(models.User,
            {
                foreignKey: 'u_id',
                targetKey:'id'
            }
        );
    }
    return Notebook;
};