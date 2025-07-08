module.exports = (sequelize, DataTypes) => {
    const Employee = sequelize.define('employee', {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      department_id: {
        type: DataTypes.INTEGER,
        references: {
          model: 'department',
          key: 'id',
        },
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE',
      },
    },
    {
        freezeTableName: true,
        timestamps: false
    });
  
    // 定义关联关系
    Employee.associate = (models) => {
      // 一个员工属于一个部门
      Employee.belongsTo(models.Department, {
        foreignKey: 'department_id',
        as: 'Department' // 确保别名与查询中使用的一致
      });
    };
  
    return Employee;
  };  