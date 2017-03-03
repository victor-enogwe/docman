import db          from '../../models/';
import validate    from '../middlewares/validate';
import utils       from '../middlewares/utils';

const documentModel = db.Document;

const Documents = {
  /**
   * Method to create a document
   * @param {Object} req the request Object
   * @param {Object} res the response Object
   * @returns {Object} the response body
   */
  create(req, res) {
    req.body.creatorId = req.decoded.id;
    return documentModel.create(req.body)
    .then(document => res.status(201)
    .json({
      status: 'success',
      data: { document }
    }));
  },

 /**
   * Method to update a document
   * @param {Object} req the request Object
   * @param {Object} res the response Object
   * @returns {Object} the response body
   */
  update(req, res) {
    documentModel.findById(req.params.id)
    .then((document) => {
      if (!document) {
        return res.status(404).send({
          status: 'fail',
          message: `Document with id:${req.params.id} not found`
        });
      }
      if (req.decoded.id !== document.creatorId) {
        return utils.authorizationFailedMessage(res);
      }
      return document.update(req.body).then(updatedDocument => res.status(201)
      .json({
        status: 'success',
        data: { document: updatedDocument }
      }));
    })
    .catch(error => res.status(500).json({
      status: 'error',
      message: error.message
    }));
  },

  /**
   * Method to delete a document
   * @param {Object} req the request Object
   * @param {Object} res the response Object
   * @returns {Object} the response body
   */
  delete(req, res) {
    documentModel.findById(req.params.id)
    .then((document) => {
      if (!document) {
        return res.status(404).send({
          status: 'fail',
          message: `Delete Failed! Document with ìd:${req.params.id} Not found`
        });
      }
      if (req.decoded.roleId !== 0 && (req.decoded.id !== document.creatorId)) {
        return utils.authorizationFailedMessage(res);
      }
      return document.destroy()
      .then(() => res.status(200).json({
        status: 'success',
        message: `Delete Successful! Document with ìd:${req.params.id} deleted`
      }));
    });
  },

  /**
   * Method to find all documents
   * @param {Object} req the request Object
   * @param {Object} res the response Object
   * @returns {Object} the response body
   */
  findAll(req, res) {
    documentModel.findAndCountAll({
      attributes: validate.filterDocumentDetails(),
      offset: req.query.offset,
      limit: req.query.limit,
      where: validate.filterDocumentsByAccess(req.query.access) ? {
        access: req.query.access
      } : {}
    })
    .then((documents) => {
      if (documents.rows.length === 0) {
        return utils.documentsNotFoundMessage(res);
      }
      return res.status(200).json({ status: 'success', data: { documents } });
    });
  },

  /**
   * Method to find a documents by id
   * @param {Object} req the request Object
   * @param {Object} res the response Object
   * @returns {Object} the response body
   */
  findOne(req, res) {
    documentModel.findById(req.params.id)
    .then((document) => {
      if (!document) {
        return utils.documentsNotFoundMessage(res);
      }
      if (parseInt(req.decoded.roleId, 10) !== 0 &&
      (req.decoded.id !== document.creatorId) && document.access !== 'public') {
        return utils.authorizationFailedMessage(res);
      }
      return res.status(200).json({
        status: 'success',
        data: { document: validate.showDocumentDetails(document) }
      });
    });
  },

  /**
   * Method to find user documents
   * @param {Object} req the request Object
   * @param {Object} res the response Object
   * @returns {Object} the response body
   */
  findUserDocs(req, res) {
    const access = validate
    .filterDocumentsByAccess(req.query.access) ? req.query.access : undefined;
    let theFilter;
    if (access) {
      theFilter = {
        creatorId: req.params.id,
        access
      };
    } else { theFilter = { creatorId: req.params.id }; }
    documentModel.findAndCountAll({ where: theFilter,
      attributes: validate.filterDocumentDetails(),
      offset: req.query.offset,
      limit: req.query.limit
    })
    .then((documents) => {
      if (documents.count === 0 || documents.rows.length === 0) {
        return utils.documentsNotFoundMessage(res);
      }
      return res.status(200).json({
        status: 'success',
        data: { documents }
      });
    });
  }
};

export default Documents;
