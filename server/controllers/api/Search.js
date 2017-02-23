import db          from '../../models/';
import validate    from '../middlewares/validate';

const searchModel = db.Document;

export default {
  search(req, res) {
    return searchModel.findAndCountAll({
      where: ['MATCH (title, excerpt) AGAINST(?)',
        req.query.phrase ? [req.query.phrase] : ['']],
      attributes: validate.filterDocumentDetails(),
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
