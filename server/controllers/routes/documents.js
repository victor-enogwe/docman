import express from 'express';
import Documents    from '../api/Documents';

const documents = express.Router();

/* GET users listing. */
documents.get('/', Documents.findAll);
documents.get('/:id', Documents.findOne);

documents.post('/', Documents.create);

documents.put('/:id', Documents.update);

documents.delete('/:id', Documents.delete);

export default documents;