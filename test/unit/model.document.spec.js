import helper from '../helpers/index.helpers';
import database     from '../../server/models/index';

const app = helper.app;
const testData = helper.testData;

describe('Document Model: ', () => {
  before((done) => { app.get('/').then(() => done()); });

  after(() => database.then(db => db.Document.destroy({ where: {} })));

  describe('Validations: ', () => {
    describe('CreatorId: ', () => {
      it('should be a number', (done) => {
        testData.userDocument.creatorId = 'a';
        database.then(db => db.Document.create(testData.userDocument))
        .catch((error) => {
          error.errors[0].message.should
          .equal('creatorId must be a number');
          testData.userDocument.creatorId = 0;
          done();
        });
      });
    });

    describe('Title: ', () => {
      it('should not allow titles that start without a letter', (done) => {
        testData.userDocument.title = '2cent is';
        database.then(db => db.Document.create(testData.userDocument))
        .catch((error) => {
          error.errors[0].message.should
          .equal('The document title must start with a letter and be \
3 - 255 characters long can also contain spaces or hyphens.');
          testData.userDocument.title = 'se';
          done();
        });
      });

      it('should not allow titles shorter than three characters', (done) => {
        database.then(db => db.Document.create(testData.userDocument))
        .catch((error) => {
          error.errors[0].message.should
          .equal('The document title must start with a letter and be \
3 - 255 characters long can also contain spaces or hyphens.');
          testData.userDocument.title = testData.longTitle;
          done();
        });
      });

      it('should not allow titles longer than 255 characters', (done) => {
        database.then(db => db.Document.create(testData.userDocument))
        .catch((error) => {
          error.errors[0].message.should
          .equal('The document title must start with a letter and be \
3 - 255 characters long can also contain spaces or hyphens.');
          testData.userDocument.title = 'hello world';
          done();
        });
      });
    });

    describe('Excerpt: ', () => {
      it('should only contain alpha-numeric characters', (done) => {
        testData.userDocument.excerpt = '!¬¬¬¬¬¬¬¬¬';
        database.then(db => db.Document.create(testData.userDocument))
        .catch((error) => {
          error.errors[0].message.should
          .equal('The excerpt should only contain alpha-numeric characters.');
          testData.userDocument.excerpt = 'hello world is a default string';
          done();
        });
      });
    });

    describe('Content: ', () => {
      it('should not allow empty document contents', (done) => {
        testData.userDocument.content = '';
        database.then(db => db.Document.create(testData.userDocument))
        .catch((error) => {
          error.errors[0].message.should
          .equal('Content  cannot be empty');
          testData.userDocument.content = '¬¬¬¬¬¬¬¬¬¬¬¬';
          done();
        });
      });

      it('should only allow alpha-numeric characters in content', (done) => {
        database.then(db => db.Document.create(testData.userDocument))
        .catch((error) => {
          error.errors[0].message.should
          .equal('The content should only contain alpha-numeric characters.');
          testData.userDocument.content = 'hello world is a default string';
          testData.userDocument.access = 'meme';
          done();
        });
      });
    });

    describe('Access: ', () => {
      it('should only allow public, private, or users in access field',
      (done) => {
        database.then(db => db.Document.create(testData.userDocument))
        .catch((error) => {
          error.errors[0].message.should
          .equal('access can only be public, private or users');
          delete testData.userDocument.access;
          testData.userDocument.creatorId = 1;
          done();
        });
      });
    });
  });

  describe('CRUD: ', () => {
    let newDocument;
    describe('Create', () => {
      it('should create a new document', (done) => {
        database.then(db => db.Document.create(testData.userDocument))
        .then((document) => {
          newDocument = document.dataValues;
          document.dataValues.should.have.property('id').which.is.a.Number();
          document.dataValues.should.have.property('access')
          .which.is.equal('private');
          done();
        });
      });

      it('should create a private document if access is not supplied',
      (done) => {
        database.then(db => db.Document.create(testData.userDocument))
        .then((document) => {
          newDocument = document.dataValues;
          document.dataValues.should.have.property('id').which.is.a.Number();
          document.dataValues.should.have.property('access')
          .which.is.equal('private');
          done();
        });
      });
    });

    describe('Read: ', () => {
      it('should get user details', (done) => {
        database.then(db => db.Document.findById(newDocument.id))
        .then((document) => {
          document.should.have.property('id').which.is.equal(newDocument.id);
          done();
        });
      });
    });

    describe('Update: ', () => {
      it('should update a document', (done) => {
        database.then(db => db.Document.findById(newDocument.id))
        .then((document) => {
          document.update({ title: 'updated document title' })
          .then((updatedDocument) => {
            updatedDocument.should.have.property('title')
            .which.is.equal('updated document title');
            done();
          });
        });
      });
    });

    describe('Delete: ', () => {
      it('should delete a document', (done) => {
        database.then(db => db.Document
        .destroy({ where: { id: newDocument.id } }))
        .then((deleted) => {
          deleted.should.equal(1);
          done();
        });
      });
    });
  });
});
