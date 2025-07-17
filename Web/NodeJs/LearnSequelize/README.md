# Sequelize用法

## 测试Sequelize迁移文件用法

+ 安装sequelize-cli
+ 执行`npx sequelize-cli model:generate --name 表名 --attributes title:string,content:text,userId:integer`生成迁移文件
+ 修改模型文件，建立关联(只关联不生成约束)`constraints: false//禁用约束生成 仅关联模型`
+ 修改迁移文件手动添加想要的约束和约束名称
+ 执行`npx sequelize-cli db:migrate`实现数据库的迁移，会在指定数据库中创建对应的表
  + 迁移操作，除了会创建对应的数据库表之外，会额外创建一个表`sequelizemeta`,记录执行的迁移操作
+ 如需回退，执行`npx sequelize-cli db:migrate:undo:all`回退迁移操作

### 种子文件

`npx sequelize db:seed:all`执行
`npx sequelize db:seed:undo --seed 指定种子文件` 撤销指定种子文件

`npx sequelize db:seed:undo:all` 撤销所有种子文件

## 测试Sequelize迁移文件针对不同环境的用法

在`config/config.json`中配置根据不同环境的数据库连接参数如`development`或`production`
在执行命令的时候使用`npx sequelize-cli db:migrate --env 环境名称`即会加载不同的环境
