module.exports = (sequelize, DataTypes) => {
    const Note = sequelize.define('Note', {
      title: DataTypes.STRING,
      content: DataTypes.TEXT,
      userId: DataTypes.INTEGER // 外键字段
    });
    
    // 建立关联（不指定约束名称）
    Note.associate = models => {
      Note.belongsTo(models.User, 
        { 
            foreignKey: 'userId',
            constraints: false//禁用约束生成 仅关联模型
        }
    );
    };
    
    return Note;
  };