import express from 'express';
import User   from '../api/User';

const users = express.Router();

/* GET users listing. */
users.get('/', User.findAll);
users.get('/:id', User.findOne);
users.get('/:id/documents/:number', User.findDocuments);

users.post('/', User.create);
users.post('/login', User.login);
users.post('/logout', User.logout);

users.put('/:id', User.update);

users.delete('/:id', User.delete);

export default users;
