export default {
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
        status: 'fail',
        message: 'You cannot delete the default admin account' });
    }
    next();
  },

  /**
   * dontChangeDefaultAdminRole disallows changing the default admin role
   * @param {Object} req the request object
   * @param {Object} res the response object
   * @param {Function} next the callback function
   * @returns {Object} validity response
   */
  dontChangeDefaultAdminRole(req, res, next) {
    if (+req.body.roleId && +req.params.id === 1 && +req.decoded.id === 1) {
      return res.status(403).send({
        status: 'fail',
        message: 'You cannot change the default admin\'s role id'
      });
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
    if (req.params.id && isNaN(parseInt(req.params.id, 10))) {
      return res.status(406).json({
        status: 'fail',
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
        status: 'fail',
        message: 'You don\'t have authorization for this action'
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
    if (isNaN(+req.query.limit) || +req.query.limit > 10
    || +req.query.limit < 1) {
      req.query.limit = 10;
    }
    req.query.limit = +req.query.limit;
    if (isNaN(+req.query.offset) || +req.query.offset > 10 ||
    +req.query.offset < 1) {
      req.query.offset = 0;
    }
    req.query.offset = +req.query.offset;
    next();
  },

  /**
   * sets and validates the search query phrase
    * @param {Object} req the request object
   * @param {Object} res the response object
   * @param {Function} next the callback function
   * @returns {Object} validity response
   */
  getSearchPhrase(req, res, next) {
    if (!req.query.phrase) {
      return res.status(400).json({
        status: 'fail',
        message: 'Please supply a query phrase parameter.'
      });
    } else if (!/[A-Za-z0-9]/i.test(req.query.phrase)) {
      return res.status(400).json({
        status: 'fail',
        message: 'Query phrase parameter can only be aplhanumeric.'
      });
    } else if (req.query.phrase.length < 4) {
      return res.status(400).json({
        status: 'fail',
        message: 'Query phrase parameter length should be greater than 4.'
      });
    }
    next();
  },

   /**
   * checks if request parameters access and user id is supplied
    * @param {Object} req the request object
   * @param {Object} res the response object
   * @param {Function} next the callback function
   * @returns {Object} validity response
   */
  searchQueryAccess(req, res, next) {
    const accepted = ['public', 'private', 'user'];
    if (req.query.access && !accepted.includes(req.query.access)) {
      return res.status(400).json({
        status: 'fail',
        message: 'Query access can only be public, private or user.'
      });
    }
    let user = '';
    if ((req.params.id && isNaN(req.params.id)) || req.params.id < 1) {
      return res.status(400).json({
        status: 'fail',
        message: 'parameter id can only be a positive number greater than 0.'
      });
    } else if (req.params.id && !isNaN(+req.params.id)) {
      user = `creatorId = '${req.params.id}' AND `;
    }

    let query = ['MATCH (title, excerpt) AGAINST(?)', [req.query.phrase]];
    if (req.query.access === 'public') {
      query =
      [`${user} access = 'public' AND MATCH (title, excerpt) AGAINST(?)`,
[req.query.phrase]];
    } else if (req.query.access === 'private') {
      query =
      [`${user} access = 'private' AND MATCH (title, excerpt) AGAINST(?)`,
[req.query.phrase]];
    } else if (req.query.access === 'user') {
      query =
      [`${user} access = 'user' AND MATCH (title, excerpt) AGAINST(?)`,
[req.query.phrase]];
    }
    req.query.search = query;
    next();
  },

  /**
   * checks if a user query parameter is supplied
    * @param {Object} req the request object
   * @param {Object} res the response object
   * @param {Function} next the callback function
   * @returns {Object} validity response
   */
  searchQueryUsers(req, res, next) {
    if (!req.query.user) {
      return res.status(400).json({
        status: 'fail',
        message: 'Please supply a search query parameter for user.'
      });
    }
    next();
  },

  loginMessage(res) {
    return res.status(401).json({
      status: 'fail',
      message: 'you need to login.'
    });
  },

  authorizationFailedMessage(res) {
    return res.status(401).send({
      status: 'fail',
      message: 'You don\'t have authorization to perform this action'
    });
  },

  documentsNotFoundMessage(res) {
    return res.status(404).json({
      status: 'fail',
      message: 'No document found'
    });
  },

  noUserFoundMessage(res) {
    return res.status(404).json({
      status: 'fail',
      message: 'No user found'
    });
  }
};
