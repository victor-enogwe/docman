'use strict';
module.exports = function(sequelize, DataTypes) {
  var Documents = sequelize.define('Documents', {
    title: DataTypes.STRING,
    creator: DataTypes.STRING,
    excerpt: DataTypes.STRING,
    access: DataTypes.INTEGER
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    }
  });
  return Documents;
};