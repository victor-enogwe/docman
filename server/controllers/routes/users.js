import express  from 'express';
import User     from '../api/User';
import auth     from '../middlewares/auth';

const users = express.Router();

users.post('/', auth.isValidUserCreateBody, User.create);
users.post('/login', auth.isValidLoginBody, User.login);
users.post('/logout', auth.checkToken, User.logout);

users.get('/', auth.checkToken, auth.isAdmin, auth.setQueryParameters,
User.findAll);
users.get('/:id', auth.isValidRequestId, auth.checkToken,
auth.canUpdateOrFindUserOrDocuments, User.findOne);

users.patch('/:id', auth.isValidRequestId, auth.checkToken,
auth.canUpdateOrFindUserOrDocuments, auth.isValidUserUpdateBody, User.update);

users.delete('/:id', auth.isValidRequestId, auth.isValidRequestId,
auth.checkToken, auth.isAdmin, auth.dontDeleteDefaultAdmin, User.delete);

export default users;
