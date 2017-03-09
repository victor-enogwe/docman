import database from '../../models/';
import validate from '../middlewares/validate';

export default {

  /**
   * search all documents available
   * @param {Object} req the request object
   * @param {Object} res the response object
   * @returns {Object} the response body
   */
  searchDocuments(req, res) {
    return database
    .then(db => db.Document.findAndCountAll({
      where: req.query.search,
      attributes: validate.filterDocumentDetails(),
      offset: req.query.offset,
      limit: req.query.limit,
    }))
    .then((results) => {
      const userDocuments = [];
      if (req.decoded.roleId !== 0) {
        results.rows.forEach((document) => {
          if (document.creatorId === req.decoded.id ||
          document.access === 'public') {
            userDocuments.push(document);
          }
        });
        results.count = userDocuments.length;
        results.rows = userDocuments;
      }
      return validate.message(results, req, res);
    });
  },

  /**
   * search all users available
   * @param {Object} req the request object
   * @param {Object} res the response object
   * @returns {Object} the response body
   */
  searchUsers(req, res) {
    return database
    .then(db => db.User.findAndCountAll({
      where: ['MATCH (username, email) AGAINST(?)', [req.query.user]],
      attributes: validate.filterUserDetails(),
      offset: req.query.offset,
      limit: req.query.limit,
    }))
    .then(results => validate.message(results, req, res));
  }
};
