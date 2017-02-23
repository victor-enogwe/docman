import db          from '../../models/';
import validate    from '../middlewares/validate';

const documentModel = db.Document;

const Documents = {
  create(req, res) {
    return documentModel.create(req.body)
    .then(newDocument => res.status(201)
    .json({ success: true, message: newDocument }))
    .catch(error => res.status(400).json({
      success: false,
      message: Array.isArray(error.errors) ? error.errors[0].message
      : error.message.substring(24)
    }));
  },

  update(req, res) {
    documentModel.findById(req.params.id)
    .then((document) => {
      if (!document) {
        return res.status(404).send({
          success: false,
          message: `Document with id:${req.params.id} not found`
        });
      }
      if (req.decoded.id !== document.creatorId) {
        return res.status(401).send({
          success: false,
          message: 'You don\'t have authorization to perform this action'
        });
      }
      return document.update(req.body).then(documentUpdated => res.status(201)
      .json({
        success: true,
        message: documentUpdated
      }));
    })
    .catch(error => res.status(500).json({ success: false, message: error }));
  },

  delete(req, res) {
    documentModel.findById(req.params.id)
    .then((document) => {
      if (!document) {
        return res.status(404).send({
          success: false,
          message: `Delete Failed! Document witn ìd:${req.params.id} Not found`
        });
      }
      if (req.decoded.roleId !== 0 || (req.decoded.id !== document.creatorId)) {
        return res.status(401).send({
          success: false,
          message: 'You don\'t have authorization to perform this action'
        });
      }
      return document.destroy()
      .then(() => res.status(200).json({
        message: `Delete Successful! Document witn ìd:${req.params.id} deleted`
      }));
    })
    .catch(error => res.status(500).json({ success: false, message: error }));
  },

  findAll(req, res) {
    documentModel.findAndCountAll({
      attributes: validate.filterDocumentDetails(),
      offset: req.query.offset,
      limit: req.query.limit,
    })
    .then((documents) => {
      if (documents.rows.length === 0) {
        return res.status(404).json({
          success: false,
          message: 'no documents found'
        });
      }
      return res.status(200).json({ success: true, documents });
    })
    .catch(error => res.status(500).json({
      success: false,
      message: error.errors
    }));
  },

  findOne(req, res) {
    documentModel.findById(req.params.id)
    .then((document) => {
      if (!document) {
        return res.status(404).json({
          success: false,
          message: 'document not found'
        });
      }
      if (req.decoded.roleId !== 0 || (req.decoded.id !== document.creatorId)) {
        return res.status(401).send({
          success: false,
          message: 'You don\'t have authorization to perform this action'
        });
      }
      return res.status(200).json({
        success: true,
        document: validate.showDocumentDetails(document)
      });
    })
    .catch(error => res.status(500).json({
      success: false,
      message: error.errors
    }));
  },

  findUserDocs(req, res) {
    documentModel.findAndCountAll({ where: {
      creatorId: req.params.id,
    },
      attributes: validate.filterDocumentDetails(),
      offset: req.query.offset,
      limit: req.query.limit,
    })
    .then((documents) => {
      if (documents.count === 0) {
        return res.status(404).json({
          success: false,
          message: 'no document not found'
        });
      }
      return res.status(200).json({
        success: true,
        documents
      });
    });
  }
};

export default Documents;
