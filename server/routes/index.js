import express from 'express';

const app = express.Router();

/* GET home page. */
app.get('/', function(req, res, next) {
  res.render('index', { title: 'Document Manager' });
});

module.exports = app;
