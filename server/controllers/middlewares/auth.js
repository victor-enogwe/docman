import jwt         from 'jsonwebtoken';
import db          from '../../models/';
import { decrypt } from '../middlewares/encrypt';
import validate    from '../middlewares/validate';

const userModel = db.User;

export default {
  /**
   * checkToken checks if request token is valid
   * @param {Object} req the request object
   * @param {Object} res the response object
   * @param {Function} next the callback function
   * @returns {Object} validity response
   */
  checkToken(req, res, next) {
    // check header or url parameters or post parameters for token
    let token = req.body.token || req.query.token ||
    req.headers['x-access-token'];
    token = validate.decryptJwt(token);
    // decode token
    if (!token) {
      return res.status(403).send({
        success: false,
        message: 'No token provided.'
      });
    }
    // verifies secret and checks exp
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        return res.status(401).json({
          success: false,
          message: 'Failed to authenticate token.'
        });
      }
      return userModel.findById(decoded.id).then((user) => {
        if (!user) {
          return res.status(404).json({
            success: false,
            message: 'This user does not exist anymore.'
          });
        } else if (!user.auth_token) {
          return res.status(401).json({
            success: false,
            message: 'you need to login.'
          });
        }
        let decryptedToken = decrypt(user.auth_token, user.password_digest);
        decryptedToken = validate.decryptJwt(decryptedToken);
        if (token !== decryptedToken) {
          return res.status(401).json({
            success: false,
            message: 'you need to login.'
          });
        }
        req.decoded = decoded;
        next();
      });
    });
  },
  /**
   * isAdmin checks if user is an admin
   * @param {Object} req the request object
   * @param {Object} res the response object
   * @param {Function} next the callback function
   * @returns {Object} validity response
   */
  isAdmin(req, res, next) {
    if (req.decoded.roleId !== 0) {
      return res.status(401).send({
        success: false,
        message: 'You don\'t have authorization to perform this action' });
    }
    next();
  },

  /**
   * dontDeleteDefaultAdmin disallows deleting the default admin account
   * @param {Object} req the request object
   * @param {Object} res the response object
   * @param {Function} next the callback function
   * @returns {Object} validity response
   */
  dontDeleteDefaultAdmin(req, res, next) {
    if (parseInt(req.params.id, 10) === 1) {
      return res.status(403).send({
        success: false,
        message: 'You cannot delete the default admin account' });
    }
    next();
  },

  /**
   * isValidRequestId checks if request id parameter is valid
   * @param {Object} req the request object
   * @param {Object} res the response object
   * @param {Function} next the callback function
   * @returns {Object} validity response
   */
  isValidRequestId(req, res, next) {
    if (isNaN(parseInt(req.params.id, 10))) {
      return res.status(406).json({
        success: false,
        message: 'parameter supplied should be a number'
      });
    }
    next();
  },

 /**
   * canUpdateOrFindUserOrDocuments checks if request id parameter is valid
   * @param {Object} req the request object
   * @param {Object} res the response object
   * @param {Function} next the callback function
   * @returns {Object} validity response
   */
  canUpdateOrFindUserOrDocuments(req, res, next) {
    if (req.decoded.roleId !== 0 && (+req.params.id !== req.decoded.id)) {
      return res.status(401).send({
        success: false,
        message: 'You don\'t have authorization for this action'
      });
    }
    next();
  },

  /**
   * isValidUserCreateBody checks if request body is valid
   * @param {Object} req the request object
   * @param {Object} res the response object
   * @param {Function} next the callback function
   * @returns {Object} validity response
   */
  isValidUserCreateBody(req, res, next) {
    const isValidRequestBody = validate.validateUserKeys(req.body);
    if (!isValidRequestBody[0]) {
      return res.status(400).json({
        success: false,
        message:
        `badly formatted request body including ( ${isValidRequestBody[1]} )`
      });
    }
    next();
  },

  /**
   * isValidDocumentCreateBody checks if update body is valid
   * @param {Object} req the request object
   * @param {Object} res the response object
   * @param {Function} next the callback function
   * @returns {Object} validity response
   */
  isValidDocumentCreateBody(req, res, next) {
    const isValidRequestBody = validate.validateDocumentKeys(req.body);
    if (!isValidRequestBody[0]) {
      return res.status(400).json({
        success: false,
        message:
        `badly formatted request body including ( ${isValidRequestBody[1]} )`
      });
    }
    next();
  },

  /**
   * isValidUserUpdateBody checks if update body is valid
   * @param {Object} req the request object
   * @param {Object} res the response object
   * @param {Function} next the callback function
   * @returns {Object} validity response
   */
  isValidUserUpdateBody(req, res, next) {
    let isValidRequestBody = validate.validateUserKeys(req.body);
    if (req.decoded.roleId === 0) {
      isValidRequestBody = validate.validateUserKeys(req.body, true);
    }
    if (!isValidRequestBody[0]) {
      return res.status(409).json({
        success: false,
        message:
        `badly formatted request body including ( ${isValidRequestBody[1]} )`
      });
    }
    next();
  },

  /**
   * isValidDocumentUpdateBody checks if update body is valid
   * @param {Object} req the request object
   * @param {Object} res the response object
   * @param {Function} next the callback function
   * @returns {Object} validity response
   */
  isValidDocumentUpdateBody(req, res, next) {
    const isValidRequestBody = validate.validateDocumentKeys(req.body, true);
    if (!isValidRequestBody[0]) {
      return res.status(400).json({
        success: false,
        message:
        `badly formatted request body including ( ${isValidRequestBody[1]} )`
      });
    }
    next();
  },

  /**
   * isValidLoginBody checks if login request body is valid
   * @param {Object} req the request object
   * @param {Object} res the response object
   * @param {Function} next the callback function
   * @returns {Object} validity response
   */
  isValidLoginBody(req, res, next) {
    const username = req.body.username;
    const email = req.body.email;
    const bodyArray = Object.keys(req.body);
    let valid = true;
    for (const key of bodyArray) {
      if (!['username', 'email', 'password'].includes(key)) {
        valid = false;
        break;
      }
    }
    if ((username && email) || !valid) {
      return res.status(401).json({
        success: false,
        message: 'Please supply either user name or email, plus your password'
      });
    }
    next();
  },

  /**
   * setQueryParameters sets request query parameters
   * @param {Object} req the request object
   * @param {Object} res the response object
   * @param {Function} next the callback function
   * @returns {Object} validity response
   */
  setQueryParameters(req, res, next) {
    req.query.limit = isNaN(+req.query.limit) || +req.query.limit > 10
    || +req.query.limit < 1 ? 10 : +req.query.limit;
    req.query.offset = isNaN(+req.query.offset) || +req.query.offset > 10 ||
    +req.query.offset < 1 ? 0 : +req.query.offset;
    next();
  }
};
