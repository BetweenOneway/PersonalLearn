const { Sequelize, Model, DataTypes } = require('sequelize');
const sequelize = new Sequelize('learndatabase', 'root', '', {
  dialect: 'mysql',
});

const Department = sequelize.define(
  'Department',
  {
    // Model attributes are defined here
    id: {
        type:DataTypes.INTEGER,
        primaryKey:true,
        allowNull:false,
        autoIncrement:true
    },
    name: {
      type: DataTypes.STRING,
      // allowNull defaults to true
    },
  },
  {
    // Other model options go here
  },
);

module.exports=Department;

