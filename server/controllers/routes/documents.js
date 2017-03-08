import express   from 'express';
import Documents from '../api/Documents';
import auth      from '../middlewares/auth';
import utils     from '../middlewares/utils';

const documents = express.Router();

documents.use(auth.checkToken);
/* GET documents listing. */
documents.get('/', auth.isAdmin, utils.setQueryParameters, Documents.findAll);
documents.get('/:id', utils.isValidRequestId, Documents.findOne);
documents.get('/user/:id', utils.isValidRequestId,
utils.canUpdateOrFindUserOrDocuments, utils.setQueryParameters,
Documents.findUserDocs);

documents.post('/', auth.isValidDocumentCreateBody, Documents.create);

documents.patch('/:id', utils.isValidRequestId, auth.isValidDocumentUpdateBody,
Documents.update);

documents.delete('/:id', utils.isValidRequestId, Documents.delete);

export default documents;
