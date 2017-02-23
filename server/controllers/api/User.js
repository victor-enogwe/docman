import db          from '../../models/';
import { encrypt } from '../middlewares/encrypt';
import validate    from '../middlewares/validate';

const userModel = db.User;

/**
 * User controller object
 */
const User = {
  /**
   * User Method to create a new user
   * @param {Object} req the request object
   * @param {Object} res the response object
   * @returns {Object} response body
   */
  create(req, res) {
    return userModel.create(req.body)
    .then(newUser => res.status(201)
    .json({ success: true, message: validate.showUserDetails(newUser) }))
    .catch(error => res.status(400).json({
      success: false,
      message: error.errors[0].message
    }));
  },

  /**
   * User Method to update a user
   * @param {Object} req the request object
   * @param {Object} res the response object
   * @returns {Object} response body
   */
  update(req, res) {
    userModel.findById(req.params.id)
    .then((user) => {
      if (!user) {
        return res.status(404).send({
          success: false,
          message: 'User Not found'
        });
      }
      return user.update(req.body).then(userUpdated => res.status(201)
      .json({
        success: true,
        message: validate.showUserDetails(userUpdated)
      }));
    })
    .catch(error => res.status(500).json({
      success: false,
      message: error.errors[0].message
    }));
  },

  /**
   * User Method to delete a user
   * @param {Object} req the request object
   * @param {Object} res the response object
   * @returns {Object} response body
   */
  delete(req, res) {
    userModel.findById(req.params.id)
    .then((user) => {
      if (!user) {
        return res.status(404).send({
          success: false,
          message: `Delete Failed! User witn ìd:${req.params.id} Not found`
        });
      }
      return user.destroy()
      .then(() => res.status(200).json({
        message: `Delete Successful! User witn ìd:${req.params.id} deleted`
      }));
    })
    .catch(error => res.status(500).json({ success: false, message: error }));
  },

  /**
   * User Method to find all users
   * @param {Object} req the request object
   * @param {Object} res the response object
   * @returns {Object} response body
   */
  findAll(req, res) {
    userModel.findAndCountAll({
      attributes: validate.filterUserDetails(),
      offset: req.query.offset,
      limit: req.query.limit,
    })
    .then((users) => {
      if (users.rows.length === 0) {
        return res.status(404).json({
          success: false,
          message: 'no users found'
        });
      }
      return res.status(200).json({ success: true, users });
    })
    .catch(error => res.status(500).json({
      success: false,
      message: error.errors
    }));
  },

  /**
   * User Method to find one user
   * @param {Object} req the request object
   * @param {Object} res the response object
   * @returns {Object} response body
   */
  findOne(req, res) {
    userModel.findById(req.params.id)
    .then((user) => {
      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'user not found'
        });
      }
      return res.status(200).json({
        success: true,
        user: validate.showUserDetails(user)
      });
    })
    .catch(error => res.status(500).json({
      success: false,
      message: error.errors
    }));
  },

  /**
   * User Method to authenticate a user
   * @param {Object} req the request object
   * @param {Object} res the response object
   * @returns {Object} response body
   */
  login(req, res) {
    userModel.findOne({ where: {
      $or: [{ username: req.body.username }, { email: req.body.email }]
    } })
    .then((user) => {
      if (!user) {
        return res.status(401).json({
          success: false,
          message: 'Authentication failed! User not found.'
        });
      }
      const authenticated = user.authenticate(req.body.password);
      if (!authenticated[0]) {
        return res.status(401).json({
          success: false,
          message: 'Authentication failed! Wrong password.'
        });
      }
      const authToken = encrypt(authenticated[1], user.password_digest);
      return user.update({
        auth_token: authToken
      }).then(() => res.status(200).json({
        success: true,
        message: 'Enjoy your token!',
        token: authenticated[1]
      }));
    })
    .catch(error => res.status(500).json({ success: false, message: error }));
  },

  /**
   * User Method to un-authenticate a user
   * @param {Object} req the request object
   * @param {Object} res the response object
   * @returns {Object} response body
   */
  logout(req, res) {
    userModel.findById(req.decoded.id)
    .then(user => user.update({ auth_token: '' }).then(() => res.status(200)
    .json({ success: true, message: 'you are now logged out' })))
    .catch(error => res.status(401).json({ success: false, message: error }));
  }
};

export default User;
