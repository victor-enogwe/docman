import Sequelize from 'sequelize';
import config    from '../../config/sequelize.config'
import users     from './users';
import documents from './documents';
import dotenv    from 'dotenv';


const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASS, {
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  dialect: process.env.DB_TYPE
});

const database = {
  users,
  documents,
}

//Export the db Object
database.sequelize = sequelize;
database.Sequelize = Sequelize; 

export default database;