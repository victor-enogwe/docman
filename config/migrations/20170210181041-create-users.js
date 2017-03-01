module.exports = {
  up: (queryInterface, Sequelize) => {
    queryInterface.createTable('User', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,

      },
      email: {
        allowNull: false,
        type: Sequelize.STRING,
        isEmail: true,
        unique: true,
      },
      username: {
        allowNull: false,
        type: Sequelize.STRING,
        unique: true
      },
      firstname: {
        type: Sequelize.STRING,
        allowNull: false
      },
      lastname: {
        type: Sequelize.STRING,
        allowNull: false
      },
      password_digest: {
        type: Sequelize.STRING,
        allowNull: false
      },
      auth_token: {
        type: Sequelize.TEXT
      },
      roleId: {
        type: Sequelize.INTEGER,
        allowNull: false
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
      'User',
      ['username', 'email'],
      {
        indexName: 'Users_Index',
        indicesType: 'FULLTEXT'
      }
    );
  },
  down: queryInterface => queryInterface.dropTable('User')
};
