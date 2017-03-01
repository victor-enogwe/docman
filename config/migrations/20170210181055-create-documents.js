module.exports = {
  up: (queryInterface, Sequelize) => {
    queryInterface.createTable('Document', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      creatorId: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: {
          model: 'User',
          key: 'id',
          as: 'creatorId'
        },
        onDelete: 'DO NOTHING',
        onUpdate: 'CASCADE'
      },
      title: {
        allowNull: false,
        type: Sequelize.STRING
      },
      excerpt: {
        type: Sequelize.STRING
      },
      content: {
        type: Sequelize.TEXT
      },
      access: {
        allowNull: false,
        type: Sequelize.STRING
      },
      authorized: {
        type: Sequelize.STRING
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
    queryInterface.addIndex(
      'Document',
      ['title', 'excerpt'],
      {
        indexName: 'Documents_Index',
        indicesType: 'FULLTEXT'
      }
    );
  },
  down: queryInterface => queryInterface.dropTable('Documents'),
};
