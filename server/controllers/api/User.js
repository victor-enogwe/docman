import models from '../../models/';

const Users = models.Users;

const User = {
  create(req, res) {
    Users.create(req.body)
      .then(function (newUser) {
        res.status(200).json(newUser);
      })
      .catch(function (error){
        res.status(500).json(error);
      });
  },
  update(req, res) {
    User.update(req.body, {
      where: {
        id: req.params.id
      }
    })
    .then(function (updatedUserRecords) {
      res.status(200).json(updatedUserRecords);
    })
    .catch(function (error){
      res.status(500).json(error);
    });
  },
  delete(req, res) {
    User.destroy({
      where: {
        id: req.params.id
      }
    })
    .then(function (deletedUserRecords) {
      res.status(200).json(deletedUserRecords);
    })
    .catch(function (error){
      res.status(500).json(error);
    });
  },
  findAll(req, res) {
     Users.findAll()
      .then(function (users) {
        res.status(200).json(users);
      })
      .catch(function (error) {
        res.status(500).json({ error });
      });
  },
  findOne(req, res) {
    Users.findById(req.params.id)
    .then(function (user) {
      res.status(200).json(user);
    })
    .catch(function (error){
      res.status(500).json({ error });
    });
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