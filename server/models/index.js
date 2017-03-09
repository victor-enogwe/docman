import mysql     from 'promise-mysql';
import Logger    from 'js-logger';
import Sequelize from 'sequelize';
import fs        from 'fs';
import config    from '../../config/db.env.config';

const environment = process.env.NODE_ENV ? `_${process.env.NODE_ENV}` : '';
const host = config.host;
const user = config.user;
const password = config.password;
const databaseName = `${config.database}${environment}`;
const port = config.port;
const dialect = config.dialect;
const dbConnection = mysql.createConnection({ host, user, password });

export default (() => {
  const db = {};
  return dbConnection.then(connection => connection
  .query(`CREATE DATABASE IF NOT EXISTS ${databaseName}`))
  .then(() => {
    Logger
    .warn('🚧 Initial Database Connection Successful. App Booting Up ...');
    const sequelize = new Sequelize(databaseName, user, password, {
      host,
      port,
      dialect,
      logging: false,
      dialectOptions: {
        multipleStatements: true
      }
    });

    fs
      .readdirSync(__dirname)
      .filter(file => (file.indexOf('.') !== 0) && (file !== 'index.js'))
      .forEach((file) => {
        const model = sequelize.import(`./${file}`);
        db[model.name] = model;
      });

    Object.keys(db).forEach((key) => {
      const model = db[key];
      if ('associate' in model) model.associate(db);
    });
    db.sequelize = sequelize;
    db.Sequelize = Sequelize;
    return db;
  });
})();

