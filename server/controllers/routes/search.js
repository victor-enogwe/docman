import express  from 'express';
import Search   from '../api/Search';
import auth     from '../middlewares/auth';

const search = express.Router();

search.use(auth.checkToken, auth.setQueryParameters);

search.get('/', Search.search);

export default search;
