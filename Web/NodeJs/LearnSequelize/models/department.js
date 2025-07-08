module.exports = (sequelize, DataTypes) => {
    const Department = sequelize.define('department', {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      location: {
        type: DataTypes.STRING,
      },
    },{
        freezeTableName: true,
        timestamps: false
    });
  
    // 定义关联关系
    Department.associate = (models) => {
      // 一个部门有多个员工
      Department.hasMany(models.Employee, {
        foreignKey: 'department_id',
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE',
      });
    };
  
    return Department;
  };  