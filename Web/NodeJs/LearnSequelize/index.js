'use strict'

// const config = require('config')
const Sequelize = require('sequelize');

const employee = require('./models/employee.js')
const department = require('./models/department.js')

// const user = require("./models/user.js");
// const post = require("./models/post.js");
const sequelize = new Sequelize('learndatabase', 'root', '', {
    dialect: 'mysql',
});

// 导入模型
const models = {
  Department: department(sequelize,Sequelize.DataTypes),
  Employee: employee(sequelize,Sequelize.DataTypes),
};

function Associate1(){
    // 建立关联关系
    Object.keys(models).forEach((modelName) => {
    if (models[modelName].associate) {
        models[modelName].associate(models);
    }
    });
}

function Associate2()
{
    models.Department.hasMany(models.Employee,{
        foreignKey:{
            name:'clubId'
        }
        
    });
    models.Employee.belongsTo(models.Department);
}

async function testFunc(){
    Associate1();
    try {
      // 同步模型到数据库（仅开发环境使用） force=true会删表重建
      await sequelize.sync({ force: true });
      console.log('数据库同步完成');
  
      // 创建测试数据
      const dept = await models.Department.create({
        name: '技术部',
        location: '北京',
      });
  
      await models.Employee.bulkCreate([
        { name: '张三', department_id: dept.id },
        { name: '李四', department_id: dept.id },
      ]);
  
      // 执行联查
      const results = await models.Employee.findAll({
        include: [
          {
            model: models.Department,
            as: 'Department', // 确保别名与模型定义一致
            attributes: ['name', 'location'],
          },
        ],
        attributes: ['name'],
      });
  
      console.log('查询结果：');
      results.forEach((emp) => {
        console.log(`${emp.name} 属于 ${emp.Department.name} (${emp.Department.location})`);
      });
    } catch (error) {
      console.error('查询出错:', error);
    } finally {
      await sequelize.close();
    }
}

async function testFunc1()
{
    const { DataTypes } = require('sequelize');

    // 定义 User 模型
    const User = sequelize.define('User', 
        {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true
            }
        },
        {
            freezeTableName: true,
            timestamps: false
        }
    );

    // 定义 Note 模型（显式指定外键约束）
    const Note = sequelize.define('Note', 
        {
            content: DataTypes.TEXT,
            // 自定义外键字段名为 u_id
            u_id: {
                type: DataTypes.INTEGER,
            }
        },
        {
            freezeTableName: true,
            timestamps: false
        }
    );

    await sequelize.sync(
        {
            logging: console.log, 
            force: true 
        }
    );
    console.log('数据库同步完成');
}

testFunc1();
