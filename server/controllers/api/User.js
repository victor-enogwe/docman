import db          from '../../models/';
import { encrypt } from '../middlewares/encrypt';
import validate    from '../middlewares/validate';
import utils       from '../middlewares/utils';

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
    .then(user => res.status(201)
    .json({
      status: 'success',
      data: { user: validate.showUserDetails(user) }
    }))
    .catch(error => res.status(400).json({
      status: 'fail',
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
        return utils.noUserFoundMessage(res);
      }
      return user.update(req.body).then(userUpdated => res.status(201)
      .json({
        status: 'success',
        data: { user: validate.showUserDetails(userUpdated) }
      }));
    })
    .catch(error => res.status(500).json({
      status: 'error',
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
          status: 'fail',
          message: `Delete Failed! User witn ìd:${req.params.id} Not found`
        });
      }
      return user.destroy()
      .then(() => res.status(200).json({
        status: 'success',
        message: `Delete Successful! User witn ìd:${req.params.id} deleted`
      }));
    });
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
        return utils.noUserFoundMessage(res);
      }
      return res.status(200).json({ status: 'success', data: { users } });
    });
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
        return utils.noUserFoundMessage(res);
      }
      return res.status(200).json({
        status: 'success',
        data: { user: validate.showUserDetails(user) }
      });
    });
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
          status: 'fail',
          message: 'Authentication failed! User not found.'
        });
      }
      const authenticated = user.authenticate(req.body.password);
      if (!authenticated[0]) {
        return res.status(401).json({
          status: 'fail',
          message: 'Authentication failed! Wrong password.'
        });
      }
      const authToken = encrypt(authenticated[1], user.password_digest);
      return user.update({
        auth_token: authToken
      }).then(() => res.status(200).json({
        status: 'success',
        data: { token: authenticated[1] }
      }));
    });
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
    .json({ status: 'success', message: 'you are now logged out' })));
  }
};

export default User;
