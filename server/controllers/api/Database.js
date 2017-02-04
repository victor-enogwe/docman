const Database = {
  create(req, res) {
    res.send('I the database post request');
  },
  page(req, res) {
    res.render('install', { title: 'Install docman', message: 'I am the db config page'});
  }
}

export default Database; 