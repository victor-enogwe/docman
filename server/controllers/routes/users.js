import express  from 'express';
import User     from '../api/User';
import auth     from '../middlewares/auth';
import utils    from '../middlewares/utils';

const users = express.Router();

users.post('/', auth.isValidUserCreateBody, User.create);

users.get('/', auth.checkToken, auth.isAdmin, utils.setQueryParameters,
User.findAll);
users.get('/:id', auth.checkToken, utils.isValidRequestId,
utils.canUpdateOrFindUserOrDocuments, User.findOne);

users.patch('/:id', auth.checkToken, utils.isValidRequestId,
utils.canUpdateOrFindUserOrDocuments, auth.isValidUserUpdateBody,
utils.dontChangeDefaultAdminRole, User.update);

users.delete('/:id', auth.checkToken, auth.isAdmin,
utils.dontDeleteDefaultAdmin, utils.isValidRequestId, User.delete);

export default users;
