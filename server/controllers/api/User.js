const User = {
  create(req, res) {
    res.send('I am creating a user');
  },
  update(req, res) {
    res.send('I am updating a user');
  },
  delete(req, res) {
    res.send('I am deleting a user tommorow');
  },
  findAll(req, res) {
    res.send('I am finding all users');
  },
  findOne(req, res) {
    res.send('I am finding a user');
  },
  findDocuments(req, res) {
    res.send('I am finding the users documents');
  },
  login(req, res) {
    res.send('I am logging a user in');
  },
  logout(req, res) {
    res.send('I am logging a user out');
  }
}

export default User;