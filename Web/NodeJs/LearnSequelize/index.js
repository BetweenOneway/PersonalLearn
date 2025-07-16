'use strict'

// const config = require('config')
const Sequelize = require('sequelize');
const sequelize = new Sequelize('learndatabase', 'root', '', {
    dialect: 'mysql',
});

const employee = require('./models/employee.js')
const department = require('./models/department.js')

// 导入模型
// const models = {
//   Department: department(sequelize,Sequelize.DataTypes),
//   Employee: employee(sequelize,Sequelize.DataTypes),
// };

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
        { name: '张三', department_id: dept.id,status:0 },
        { name: '李四', department_id: dept.id,status:1 },
      ]);
  
      // 执行联查
      const results = await models.Employee.findAll({
        attributes: ['name'],
        include: [
          {
            model: models.Department,
            as: 'Department', // 确保别名与模型定义一致
            attributes: ['name', 'location'],
          },
        ],
        where: {
            status: {
              [Sequelize.Op.ne]: 1
            }
        },
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

//testFunc();

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

//无关联情况下的多表联查—使用原生SQL
async function testNotAssociateQuery()
{
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
    
        let results;
        //使用原生SQL直接查询
        if(true)
        {
            [results] = await sequelize.query(
                `SELECT * FROM Employee WHERE Employee.department_id = :departmentId`,
                {
                  replacements: { departmentId: 1 }, // 参数化值
                  type: sequelize.QueryTypes.SELECT
                }
              );
        }
        else{
            results = await sequelize.query(
                `SELECT 
                Employee.name AS userName, 
                Department.name As departmentName
                FROM 
                Employee 
                JOIN 
                Department ON Employee.department_id = Department.id`,
                {
                    type: sequelize.QueryTypes.SELECT,
                }
            );
        }

        // 结果处理
        console.log("query results=>",results)

        //console.log("query metadata=>",metadata)
    } catch (error) {
        console.error('查询出错:', error);
    } finally {
        await sequelize.close();
    }
}

async function testMigrationTable()
{

}

//测试定义表时，写reference和不写reference有什么区别 以及关联对建表语句的影响
async function testReference()
{
    console.log("test references");
    // models/User.js
    const User = sequelize.define('User', 
        {
            segmentKey: { 
                type: Sequelize.DataTypes.INTEGER, 
                primaryKey: true, 
                autoIncrement: true 
            },
            name: Sequelize.DataTypes.STRING,
        }, 
        {
            timestamps: false // true --启用自动生成 created_at 和 updated_at 字段 false 不自动生成
        }
    );
  
    // models/Post.js
    const Post = sequelize.define('Post', 
        {
            id: { 
                type: Sequelize.DataTypes.INTEGER, 
                primaryKey: true, 
                autoIncrement: true 
            },
            title: Sequelize.DataTypes.STRING,
            UserKey: {
                type: Sequelize.DataTypes.INTEGER,
                // 放开这
                // references: {
                //   model: 'Users',  // 引用 Users 表
                //   key: 'segmentKey'        // 引用 id 字段
                // }
            }
        }, 
        {
            timestamps: false // true --启用自动生成 created_at 和 updated_at 字段 false 不自动生成
        }
    );
  
    // 定义关联关系 source.hasMany(target)
    //或放开这
    User.hasMany(Post,{
        foreignKey:'UserKey',
        sourceKey:'segmentKey'
    });

    Post.belongsTo(User,{
        foreignKey:'UserKey',
        targetKey:'segmentKey'
    });

    try {
        await sequelize.sync({ force: true });
        console.log('test references数据库同步完成');
    
    } catch (error) {
        console.log("test references occurs error=>",error);
    }
}

testReference();
