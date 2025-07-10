# 运行

## VSCode中使用PowerShell测试

执行`$env:NODE_ENV="development"; node app.js`

## 测试Sequelize迁移文件用法

执行`npx sequelize-cli db:migrate`实现数据库的迁移，会在指定数据库中创建对应的表
    + 迁移操作，除了会创建对应的数据库表之外，会额外创建一个表`sequelizemeta`,记录执行的迁移操作

执行`npx sequelize-cli db:migrate:undo:all`回退迁移操作

## 测试Sequelize迁移文件配合node-config用法
