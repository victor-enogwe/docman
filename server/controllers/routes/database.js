import express from 'express';
import Database    from '../api/Database';

const database = express.Router();

/* GET users listing. */
database.get('/', Database.page);

database.post('/', Database.create);

export default database;