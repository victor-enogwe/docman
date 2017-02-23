import express from 'express';

const home = express.Router();

/* GET home page. */
home.get('/', (req, res) => {
  res.status(200).json({ message: 'Welcome to the document manage api.' });
});

export default home;
