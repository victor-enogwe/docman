import express from 'express';
import User    from '../api/User';
import auth    from '../middlewares/auth';

const home = express.Router();

/* GET home page. */
home.get('/', (req, res) => {
  res.status(200).json({ message: 'Welcome to the document management api.' });
});

home.post('/login', auth.isValidLoginBody, User.login);
home.post('/logout', auth.checkToken, User.logout);

export default home;
