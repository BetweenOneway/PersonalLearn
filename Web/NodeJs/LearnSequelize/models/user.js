const { Sequelize, Model, DataTypes } = require('sequelize');
const sequelize = new Sequelize('database', 'username', 'password', {
  dialect: 'mysql',
});

class User extends Model {}
User.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  username: DataTypes.STRING,
  uniqueUserId: {
    type: DataTypes.STRING, // 自定义唯一标识，作为关联源键
    unique: true,
  },
}, { sequelize, modelName: 'user' });

module.exports = User;  