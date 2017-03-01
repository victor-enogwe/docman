import express  from 'express';
import Search   from '../api/Search';
import auth     from '../middlewares/auth';
import utils    from '../middlewares/utils';

const search = express.Router();

search.use(auth.checkToken, utils.setQueryParameters);

search.get('/documents', utils.getSearchPhrase, utils.searchQueryAccess,
Search.searchDocuments);

search.get('/documents/user/:id', utils.getSearchPhrase,
utils.searchQueryAccess, Search.searchDocuments);
search.get('/users', auth.isAdmin, utils.searchQueryUsers,
utils.setQueryParameters, Search.searchUsers);

export default search;
