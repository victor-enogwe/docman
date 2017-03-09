import jwt         from 'jsonwebtoken';
import database    from '../../models/';
import { decrypt } from '../middlewares/encrypt';
import validate    from '../middlewares/validate';
import utils       from '../middlewares/utils';

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
        status: 'fail',
        message: 'No token provided.'
      });
    }
    // verifies secret and checks exp
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        return res.status(401).json({
          status: 'fail',
          message: 'Failed to authenticate token.'
        });
      }
      return database
      .then(db => db.User.findById(decoded.id))
      .then((user) => {
        if (!user) {
          return res.status(404).json({
            status: 'fail',
            message: 'This user does not exist anymore.'
          });
        }
        let decryptedToken = decrypt(user.auth_token, user.password_digest);
        decryptedToken = validate.decryptJwt(decryptedToken);
        if (!user.auth_token || token !== decryptedToken) {
          return utils.loginMessage(res);
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
      return utils.authorizationFailedMessage(res);
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
    return validate.validRequestBodyCheck(isValidRequestBody, res, next);
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
    return validate.validRequestBodyCheck(isValidRequestBody, res, next);
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
    return validate.validRequestBodyCheck(isValidRequestBody, res, next);
  },

  /**
   * isValidDocumentUpdateBody checks if update body is valid
   * @param {Object} req the request object
   * @param {Object} res the response object
   * @param {Function} next the callback function
   * @returns {Object} validity response
   */
  isValidDocumentUpdateBody(req, res, next) {
    const isValidRequestBody = validate.validateDocumentKeys(req.body);
    return validate.validRequestBodyCheck(isValidRequestBody, res, next);
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
        status: 'fail',
        message: 'Please supply either user name or email, plus your password'
      });
    }
    next();
  }
};
