const { Sequelize, Model, DataTypes } = require('sequelize');
const sequelize = new Sequelize('learndatabase', 'root', '', {
  dialect: 'mysql',
});

class Employee extends Model {}
Employee.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: DataTypes.STRING,
  department_id:DataTypes.INTEGER
}, { sequelize, modelName: 'employee' });

module.exports = Employee;  