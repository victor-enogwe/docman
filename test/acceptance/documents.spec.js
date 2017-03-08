import helper from '../helpers/index.helpers';
import db     from '../../server/models/index';

const app = helper.app;
const testData = helper.testData;
let regularUser, adminToken, regularUserToken, privateDocument, publicDocument;

describe('Document Api', () => {
  before((done) => {
    app.post('/login').send({
      username: testData.adminUser.username,
      password: testData.adminUser.password
    })
    .then((res) => {
      adminToken = res.body.data.token;
      app.post('/api/v1/users').send(testData.validUser)
      .then((response) => {
        regularUser = response.body.data.user;
        app.post('/login').send({
          username: testData.validUser.username,
          password: testData.validUser.password
        })
        .then((res) => {
          regularUserToken = res.body.data.token;
          done();
        });
      });
    });
  });

  after(() => db.User.destroy({ where: { roleId: 1 } })
    .then(() => db.Document.destroy({ where: {} })));

  describe('Create: ', () => {
    it('should create a new document', (done) => {
      app.post('/api/v1/documents')
      .send(testData.userDocument)
      .set({ 'x-access-token': adminToken })
        .end((error, response) => {
          privateDocument = response.body.data.document;
          response.status.should.equal(201);
          response.body.status.should.equal('success');
          done();
        });
    });

    it('should not create document if an invalid creation data is supplied',
    (done) => {
      testData.userDocument.mode = 'ff';
      app.post('/api/v1/documents')
      .send(testData.userDocument)
      .set({ 'x-access-token': regularUserToken })
      .then((response) => {
        response.status.should.equal(400);
        response.body.status.should.equal('fail');
        response.body.message.should
        .equal('badly formatted request body including ( mode )');
        done();
      });
    });

    it('should send an error message for a user not logged in', (done) => {
      app.post('/api/v1/documents')
      .send(testData.userDocument)
        .end((error, response) => {
          response.status.should.equal(403);
          response.body.status.should.equal('fail');
          response.body.message.should
          .equal('No token provided.');
          done();
        });
    });

    it('should be able create a private document', (done) => {
      delete testData.userDocument.mode;
      app.post('/api/v1/documents')
      .send(testData.userDocument)
      .set({ 'x-access-token': regularUserToken })
        .end((error, response) => {
          response.body.status.should.equal('success');
          response.body.data.document.access.should.equal('private');
          done();
        });
    });

    it('should be able create a public document', (done) => {
      testData.userDocument.access = 'public';
      app.post('/api/v1/documents')
      .send(testData.userDocument)
      .set({ 'x-access-token': regularUserToken })
        .end((error, response) => {
          publicDocument = response.body.data.document;
          response.body.status.should.equal('success');
          response.body.data.document.access.should.equal('public');
          done();
        });
    });

    it('should create a document with an id', () => {
      privateDocument.should.have.property('id');
      publicDocument.should.have.property('id');
    });
  });

  describe('Get Document: ', () => {
    it('should get a private document for an admin', (done) => {
      app.get(`/api/v1/documents/${privateDocument.id}`)
      .set({ 'x-access-token': adminToken })
        .end((error, response) => {
          response.status.should.equal(200);
          response.body.status.should.equal('success');
          response.body.data.document.should.have.property('id');
          response.body.data.document.should.have.property('title');
          done();
        });
    });

    it('should get a public document for an admin', (done) => {
      app.get(`/api/v1/documents/${publicDocument.id}`)
      .set({ 'x-access-token': adminToken })
        .end((error, response) => {
          response.status.should.equal(200);
          response.body.status.should.equal('success');
          response.body.data.document.should.have.property('id');
          response.body.data.document.should.have.property('title');
          done();
        });
    });

    it(`should not return a private document to a regular user
    who does not own the document`, (done) => {
      app.get(`/api/v1/documents/${privateDocument.id}`)
      .set({ 'x-access-token': regularUserToken })
        .end((err, res) => {
          res.status.should.equal(401);
          res.body.message.should
          .equal('You don\'t have authorization to perform this action');
          done();
        });
    });

    it('should not get documents for a non logged in users', (done) => {
      app.get(`/api/v1/documents/${privateDocument.id}`)
        .end((err, res) => {
          res.status.should.equal(403);
          res.body.message.should.equal('No token provided.');
          done();
        });
    });

    it('should return not found for a document not created', (done) => {
      app.get('/api/v1/documents/1220000')
      .set({ 'x-access-token': adminToken })
        .end((err, res) => {
          res.status.should.equal(404);
          res.body.message.should.equal('No document found');
          done();
        });
    });
  });

  describe('Get Documents: ', () => {
    it('should get all documents for an admin', (done) => {
      app.get('/api/v1/documents/')
      .set({ 'x-access-token': adminToken })
        .end((error, response) => {
          response.status.should.equal(200);
          response.body.status.should.equal('success');
          response.body.data.documents.should.have.property('count');
          response.body.data.documents.should.have.property('rows');
          done();
        });
    });

    it('should not allow a regular user to get all documents', (done) => {
      app.get('/api/v1/documents/')
      .set({ 'x-access-token': regularUserToken })
        .end((error, response) => {
          response.status.should.equal(401);
          response.body.status.should.equal('fail');
          response.body.message.should
          .equal('You don\'t have authorization to perform this action');
          done();
        });
    });

    it('should get public documents for an admin', (done) => {
      app.get('/api/v1/documents?access=public')
      .set({ 'x-access-token': adminToken })
        .end((error, response) => {
          const documents = response.body.data.documents.rows;
          let allPublic = true;
          for (const document of documents) {
            if (document.access !== 'public') {
              allPublic = false;
              return false;
            }
          }
          response.status.should.equal(200);
          response.body.status.should.equal('success');
          allPublic.should.equal(true);
          done();
        });
    });

    it('should get private documents for an admin', (done) => {
      app.get('/api/v1/documents?access=private')
      .set({ 'x-access-token': adminToken })
        .end((error, response) => {
          const documents = response.body.data.documents.rows;
          let allPrivate = true;
          for (const document of documents) {
            if (document.access !== 'private') {
              allPrivate = false;
              return false;
            }
          }
          response.status.should.equal(200);
          response.body.status.should.equal('success');
          allPrivate.should.equal(true);
          done();
        });
    });

    it('should limit number of documents per request to ten or below',
    (done) => {
      app.get('/api/v1/documents')
      .set({ 'x-access-token': adminToken })
        .end((error, response) => {
          const documentLength = response.body.data.documents.rows.length;
          response.status.should.equal(200);
          response.body.status.should.equal('success');
          documentLength.should.belowOrEqual(10);
          done();
        });
    });

    it('should be able to limit the number of documents returned',
    (done) => {
      app.get('/api/v1/documents?limit=2')
      .set({ 'x-access-token': adminToken })
        .end((error, response) => {
          const documentLength = response.body.data.documents.rows.length;
          response.status.should.equal(200);
          response.body.status.should.equal('success');
          documentLength.should.equal(2);
          done();
        });
    });

    it('should be able to set an offset for documents returned',
    (done) => {
      app.get('/api/v1/documents?offset=1')
      .set({ 'x-access-token': adminToken })
        .end((error, response) => {
          const count = response.body.data.documents.count;
          const documentLength = response.body.data.documents.rows.length;
          response.status.should.equal(200);
          response.body.status.should.equal('success');
          documentLength.should.equal(count - 1);
          done();
        });
    });

    it('should return not found for offset the database can\'t reach',
    (done) => {
      app.get('/api/v1/documents?offset=6&limit=10')
      .set({ 'x-access-token': adminToken })
        .end((error, response) => {
          response.status.should.equal(404);
          response.body.status.should.equal('fail');
          response.body.message.should.equal('No document found');
          done();
        });
    });
  });

  describe('Get User\'s Document', () => {
    it('should all documents of a particular user',
    (done) => {
      app.get(`/api/v1/documents/user/${regularUser.id}`)
      .set({ 'x-access-token': adminToken })
        .end((error, response) => {
          response.status.should.equal(200);
          response.body.status.should.equal('success');
          response.body.data.documents.should.have.property('count');
          response.body.data.documents.should.have.property('rows');
          done();
        });
    });

    it('should return no document for user if offset and limit is \
larger than available data',
    (done) => {
      app.get(`/api/v1/documents/user/${regularUser.id}?offset=9&limit=6`)
      .set({ 'x-access-token': adminToken })
        .end((error, response) => {
          response.status.should.equal(404);
          response.body.status.should.equal('fail');
          response.body.message.should.equal('No document found');
          done();
        });
    });

    it('should all private documents of a particular user',
    (done) => {
      app.get(`/api/v1/documents/user/${regularUser.id}?access=private`)
      .set({ 'x-access-token': adminToken })
        .end((error, response) => {
          response.status.should.equal(200);
          response.body.status.should.equal('success');
          response.body.data.documents.rows[0].access.should.equal('private');
          done();
        });
    });

    it('should all public documents of a particular user',
    (done) => {
      app.get(`/api/v1/documents/user/${regularUser.id}?access=public`)
      .set({ 'x-access-token': adminToken })
        .end((error, response) => {
          response.status.should.equal(200);
          response.body.status.should.equal('success');
          response.body.data.documents.rows[0].access.should.equal('public');
          done();
        });
    });
  });

  describe('Update Documents: ', () => {
    it('should edit a document the user has access to.', (done) => {
      app.patch(`/api/v1/documents/${publicDocument.id}`)
      .send({
        title: 'Hello world are you here',
      })
      .set({ 'x-access-token': regularUserToken })
        .end((error, response) => {
          response.status.should.equal(201);
          response.body.status.should.equal('success');
          response.body.data.document.title.should
          .equal('Hello world are you here');
          done();
        });
    });

    it('should not edit a document the user has no access to.', (done) => {
      app.patch(`/api/v1/documents/${privateDocument.id}`)
      .send({
        title: 'Hello world are you here',
      })
      .set({ 'x-access-token': regularUserToken })
        .end((error, response) => {
          response.status.should.equal(401);
          response.body.status.should.equal('fail');
          response.body.message.should
          .equal('You don\'t have authorization to perform this action');
          done();
        });
    });

    it('should return not found for a non-existing document', (done) => {
      app.patch('/api/v1/documents/1220000')
      .send({
        title: 'hmmm say something'
      })
      .set({ 'x-access-token': regularUserToken })
        .end((error, response) => {
          response.status.should.equal(404);
          response.body.status.should.equal('fail');
          done();
        });
    });

    it('should not allow update for an unathorized request', (done) => {
      app.patch(`/api/v1/documents/${privateDocument.id}`)
      .send({
        title: 'hmmm say something'
      })
      .end((error, response) => {
        response.status.should.equal(403);
        response.body.status.should.equal('fail');
        response.body.message.should.equal('No token provided.');
        done();
      });
    });

    it('should not allow update if the request id is invalid.', (done) => {
      app.patch('/api/v1/documents/hello')
      .send({
        title: 'Hello world are you here',
      })
      .set({ 'x-access-token': regularUserToken })
        .end((error, response) => {
          response.status.should.equal(406);
          response.body.status.should.equal('fail');
          response.body.message.should
          .equal('parameter supplied should be a number');
          done();
        });
    });

    it('should not edit a document if the update title is invalid.', (done) => {
      app.patch(`/api/v1/documents/${publicDocument.id}`)
      .send({
        title: '2ello world are you here',
      })
      .set({ 'x-access-token': regularUserToken })
        .end((error, response) => {
          response.status.should.equal(500);
          response.body.status.should.equal('error');
          response.body.message.should
          .equal('Validation error: The document title must start with a letter\
 and be 3 - 255 characters long can also contain spaces or hyphens.');
          done();
        });
    });

    it('should not edit a document if the update excerpt is invalid.',
    (done) => {
      app.patch(`/api/v1/documents/${publicDocument.id}`)
      .send({
        excerpt: '¬¬¬¬¬¬',
      })
      .set({ 'x-access-token': regularUserToken })
        .end((error, response) => {
          response.status.should.equal(500);
          response.body.status.should.equal('error');
          response.body.message.should
          .equal('Validation error: The excerpt should only contain \
alpha-numeric characters.');
          done();
        });
    });

    it('should not edit a document if the update content is invalid.',
    (done) => {
      app.patch(`/api/v1/documents/${publicDocument.id}`)
      .send({
        content: '¬¬¬¬¬¬',
      })
      .set({ 'x-access-token': regularUserToken })
        .end((error, response) => {
          response.status.should.equal(500);
          response.body.status.should.equal('error');
          response.body.message.should
          .equal('Validation error: The content should only contain \
alpha-numeric characters.');
          done();
        });
    });

    it('should not edit a document if the update content contains html.',
    (done) => {
      app.patch(`/api/v1/documents/${publicDocument.id}`)
      .send({
        content: 'hello how are<script> hello world</script>',
      })
      .set({ 'x-access-token': regularUserToken })
        .end((error, response) => {
          response.status.should.equal(500);
          response.body.status.should.equal('error');
          response.body.message.should
          .equal('Document content contains dissallowed markup');
          done();
        });
    });

    it('should not edit a document if the update excerpt contains html.',
    (done) => {
      app.patch(`/api/v1/documents/${publicDocument.id}`)
      .send({
        excerpt: 'hello how are<script> hello world</script>',
      })
      .set({ 'x-access-token': regularUserToken })
        .end((error, response) => {
          response.status.should.equal(500);
          response.body.status.should.equal('error');
          response.body.message.should
          .equal('Document excerpt contains dissallowed markup');
          done();
        });
    });

    it('should not edit a document if the update content is empty.',
    (done) => {
      app.patch(`/api/v1/documents/${publicDocument.id}`)
      .send({
        content: '',
      })
      .set({ 'x-access-token': regularUserToken })
        .end((error, response) => {
          response.status.should.equal(500);
          response.body.status.should.equal('error');
          done();
        });
    });
  });

  describe('User\'s document: ', () => {
    it('should return all documents to the owner', (done) => {
      app.get(`/api/v1/documents/user/${regularUser.id}`)
      .set({ 'x-access-token': regularUserToken })
        .end((error, response) => {
          response.status.should.equal(200);
          response.body.data.should.be.an.Object();
          done();
        });
    });

    it(`should return all documents for a particular user
    to an admin`, (done) => {
      app.get(`/api/v1/documents/user/${regularUser.id}`)
      .set({ 'x-access-token': adminToken })
        .end((error, response) => {
          response.status.should.equal(200);
          response.body.data.should.be.a.Object();
          done();
        });
    });

    it(`should return error if
    user is not an admin or the owner of the document`, (done) => {
      app.get('/api/v1/documents/user/1')
      .set({ 'x-access-token': regularUserToken })
        .end((error, response) => {
          response.status.should.equal(401);
          response.body.status.should.equal('fail');
          response.body.message.should
          .equal('You don\'t have authorization for this action');
          done();
        });
    });

    it('should return error if user is not logged in', (done) => {
      app.get(`/api/v1/documents/user/${regularUser.id}`)
        .end((error, response) => {
          response.status.should.equal(403);
          response.body.status.should.equal('fail');
          response.body.message.should
          .equal('No token provided.');
          done();
        });
    });
  });

  describe('Delete: ', () => {
    it('should allow a regular user delete their document', (done) => {
      app.delete(`/api/v1/documents/${publicDocument.id}`)
      .set({ 'x-access-token': regularUserToken })
        .end((error, response) => {
          response.status.should.equal(200);
          response.body.message.should
          .equal(`Delete Successful! Document with \
ìd:${publicDocument.id} deleted`);
          done();
        });
    });

    it('should return not found for a non-existing document', (done) => {
      app.delete('/api/v1/documents/12200000')
      .set({ 'x-access-token': adminToken })
        .end((error, response) => {
          response.status.should.equal(404);
          response.body.message.should
          .equal('Delete Failed! Document with ìd:12200000 Not found');
          done();
        });
    });

    it('should prevent a user who doesn\'t  own the document from deleting it',
    (done) => {
      app.delete(`/api/v1/documents/${privateDocument.id}`)
      .set({ 'x-access-token': regularUserToken })
        .end((error, response) => {
          response.status.should.equal(401);
          response.body.status.should.equal('fail');
          response.body.message.should
          .equal('You don\'t have authorization to perform this action');
          done();
        });
    });

    it('should allow an admin to delete any document', (done) => {
      app.delete(`/api/v1/documents/${privateDocument.id}`)
      .set({ 'x-access-token': adminToken })
        .end((error, response) => {
          response.status.should.equal(200);
          response.body.message.should
          .equal(`Delete Successful! Document with \
ìd:${privateDocument.id} deleted`);
          done();
        });
    });

    it('should fail if user is not authorized', (done) => {
      app.delete(`/api/v1/documents/${publicDocument.id}`)
        .end((error, response) => {
          response.status.should.equal(403);
          response.body.status.should.equal('fail');
          response.body.message.should
          .equal('No token provided.');
          done();
        });
    });
  });
});

