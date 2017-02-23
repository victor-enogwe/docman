import express from 'express';

const home = express.Router();

/* GET home page. */
home.get('/', (req, res) => {
  res.render('index', { title: 'Document Manager' });
});

export default home;
