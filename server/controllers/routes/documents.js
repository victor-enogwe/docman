import express from 'express';
import Documents    from '../api/Documents';
import auth     from '../middlewares/auth';

const documents = express.Router();

documents.use(auth.checkToken);
/* GET users listing. */
documents.get('/', auth.isAdmin, auth.setQueryParameters, Documents.findAll);
documents.get('/:id', auth.isValidRequestId, Documents.findOne);
documents.get('/user/:id', auth.isValidRequestId,
auth.canUpdateOrFindUserOrDocuments, auth.setQueryParameters,
Documents.findUserDocs);

documents.post('/', auth.isValidDocumentCreateBody, Documents.create);

documents.patch('/:id', auth.isValidRequestId, auth.isValidDocumentUpdateBody,
Documents.update);

documents.delete('/:id', auth.isValidRequestId, Documents.delete);

export default documents;
