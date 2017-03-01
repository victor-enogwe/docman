import express  from 'express';
import Search   from '../api/Search';
import auth     from '../middlewares/auth';

const search = express.Router();

search.use(auth.checkToken, auth.setQueryParameters);

search.get('/documents', auth.getSearchPhrase, auth.searchQueryAccess,
Search.searchDocuments);

search.get('/documents/user/:id', auth.getSearchPhrase, auth.searchQueryAccess,
Search.searchDocuments);
search.get('/users', auth.isAdmin, auth.searchQueryUsers,
auth.setQueryParameters, Search.searchUsers);

export default search;
