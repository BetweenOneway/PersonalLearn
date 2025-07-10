module.exports = {
    up: async (queryInterface, Sequelize) => {
      await queryInterface.createTable('Notes', {
        id: {
          allowNull: false,
          autoIncrement: true,
          primaryKey: true,
          type: Sequelize.INTEGER
        },
        title: {
          type: Sequelize.STRING
        },
        content: {
          type: Sequelize.TEXT
        },
        userId: {
          type: Sequelize.INTEGER,
        },
        createdAt: {
          allowNull: false,
          type: Sequelize.DATE
        },
        updatedAt: {
          allowNull: false,
          type: Sequelize.DATE
        }
      });
  
      // 添加命名外键约束
      await queryInterface.addConstraint('Notes', {
        fields: ['userId'],
        type: 'foreign key',
        name: 'user_note_fk', // 指定外键约束名称
        references: {
          table: 'Users',
          field: 'id'
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
      });
    },
    
    down: async (queryInterface, Sequelize) => {
      // 先删除约束，再删除表
      await queryInterface.removeConstraint('Notes', 'user_note_fk');
      await queryInterface.dropTable('Notes');
    }
  };