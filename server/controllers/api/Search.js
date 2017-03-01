import db          from '../../models/';
import validate    from '../middlewares/validate';

const searchDocuments = db.Document;
const searchUsers = db.User;

export default {

  /**
   * search all documents available
   * @param {Object} req the request object
   * @param {Object} res the response object
   * @returns {Object} the response body
   */
  searchDocuments(req, res) {
    return searchDocuments.findAndCountAll({
      where: req.query.search,
      attributes: validate.filterDocumentDetails(),
      offset: req.query.offset,
      limit: req.query.limit,
    })
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
      if (results.rows.length === 0) {
        return res.status(404).json({
          success: false,
          message: `no results found for your query ${req.query.phrase}`
        });
      }
      return res.status(200).json({ success: true, results });
    });
  },

  /**
   * search all users available
   * @param {Object} req the request object
   * @param {Object} res the response object
   * @returns {Object} the response body
   */
  searchUsers(req, res) {
    return searchUsers.findAndCountAll({
      where: ['MATCH (username, email) AGAINST(?)',
        req.query.user ? [req.query.user] : ['']],
      attributes: validate.filterUserDetails(),
      offset: req.query.offset,
      limit: req.query.limit,
    })
    .then((results) => {
      if (results.rows.length === 0) {
        return res.status(404).json({
          success: false,
          message: `no results found for your query ${req.query.phrase}`
        });
      }
      return res.status(200).json({ success: true, results });
    });
  }
};
