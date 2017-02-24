import Sequelize   from 'sequelize';
import fs          from 'fs';
import config      from '../../config/db.env.config';

const host = config.host;
const user = config.user;
const password = config.password;
const database = config.database;
const port = config.port;
const dialect = config.dialect;
const db = {};
const sequelize = new Sequelize(database, user, password, {
  host, port, dialect, logging: false
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

export default db;
