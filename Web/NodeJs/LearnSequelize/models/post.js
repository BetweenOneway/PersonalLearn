const { Sequelize, Model, DataTypes } = require('sequelize');
const sequelize = new Sequelize('database', 'username', 'password', {
  dialect: 'mysql',
});
const User = require('./user');

class Post extends Model {}
Post.init({
  title: DataTypes.STRING,
  content: DataTypes.TEXT,
  authorId: { // 外键字段（默认会自动创建，但建议显式定义）
    type: DataTypes.INTEGER,
    references: {
      model: User,
      key: 'id', // 引用 User 模型的 id 字段（默认）
    },
    onDelete: 'CASCADE', // 级联删除
  },
  authorUniqueId: { // 自定义外键，引用 User.uniqueUserId
    type: DataTypes.STRING,
    references: {
      model: User,
      key: 'uniqueUserId',
    },
  },
}, { sequelize, modelName: 'post' });

// 定义关联关系
User.hasMany(Post, {
  foreignKey: 'authorId', // 指定 Post 模型中的外键字段名
  sourceKey: 'id',        // 指定 User 模型中关联的源字段（默认是主键 id）
});

// 另一种关联（使用自定义外键和源键）
User.hasMany(Post, {
  as: 'CustomPosts',      // 别名，用于区分多个关联
  foreignKey: 'authorUniqueId', // 外键字段名
  sourceKey: 'uniqueUserId',    // 源键字段名（User.uniqueUserId）
});

module.exports = Post;  