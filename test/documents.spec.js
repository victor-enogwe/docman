import helper from './helpers/index.helpers';
import db     from '../server/models/index';

const app = helper.app;
const testData = helper.testData;
let regularUserToken, regularUserId, regularUser1Token,
  adminToken, publicRegularUserDocumentId, privateRegularUserDocumentId;

before((done) => {
  db.User.destroy({
    where: {
      roleId: 1
    }
  }).then(() => {
    db.Document.destroy({ where: {} })
    .then(() => {
      app.post('/api/v1/users')
      .send(testData.validUser6)
      .end((err, res) => {
        regularUserId = res.body.message.id;
        testData.validUser6Document.creatorId = regularUserId;
        app.post('/login')
        .send({
          username: testData.validUser6.username,
          password: testData.validUser6.password
        })
        .end((error, response) => {
          regularUserToken = response.body.token;
          app.post('/login')
          .send({
            username: testData.adminUser.username,
            password: testData.adminUser.password
          })
          .end((err, res) => {
            if (!err) {
              adminToken = res.body.token;
              app.post('/api/v1/users')
              .send(testData.validUser7)
              .end((err, res) => {
                if (!err && res) {
                  app.post('/login')
                  .send({
                    username: testData.validUser7.username,
                    password: testData.validUser7.password
                  })
                  .end((err, res) => {
                    if (!err) regularUser1Token = res.body.token;
                    done();
                  });
                }
              });
            }
          });
        });
      });
    });
  });
});

describe('Document Api', () => {
  describe('Create: ', () => {
    it('should create a new document', (done) => {
      app.post('/api/v1/documents')
      .send(testData.validUser6Document)
      .set({ 'x-access-token': regularUserToken })
        .end((error, response) => {
          privateRegularUserDocumentId = response.body.message.id;
          response.status.should.equal(201);
          response.body.success.should.equal(true);
          done();
        });
    });

    it('should not create document without a creatorId', (done) => {
      app.post('/api/v1/documents')
      .send(testData.invalidUser6Document)
      .set({ 'x-access-token': regularUserToken })
        .end((error, response) => {
          console.log(response.body)
          response.status.should.equal(400);
          response.body.success.should.equal(false);
          response.body.message.should.equal('creatorId cannot be null');
          done();
        });
    });

    it('should not create document if an invalid creation data is supplied',
    (done) => {
      testData.invalidUser6Document.mode = '';
      app.post('/api/v1/documents')
      .send(testData.invalidUser6Document)
      .set({ 'x-access-token': regularUserToken })
        .end((error, response) => {
          response.status.should.equal(400);
          response.body.success.should.equal(false);
          response.body.message.should
          .equal('badly formatted request body including ( mode )');
          done();
        });
    });

    it('should send an error message for a user not logged in', (done) => {
      app.post('/api/v1/documents')
      .send(testData.validUser6Document)
        .end((error, response) => {
          response.status.should.equal(403);
          response.body.success.should.equal(false);
          response.body.message.should
          .equal('No token provided.');
          done();
        });
    });

    it('should be able create a private document', (done) => {
      app.post('/api/v1/documents')
      .send(testData.validUser6Document)
      .set({ 'x-access-token': regularUserToken })
        .end((error, response) => {
          response.body.success.should.equal(true);
          response.body.message.access.should.equal('private');
          done();
        });
    });

    it('should be able create a public document', (done) => {
      testData.validUser6Document.access = 'public';
      app.post('/api/v1/documents')
      .send(testData.validUser6Document)
      .set({ 'x-access-token': regularUserToken })
        .end((error, response) => {
          publicRegularUserDocumentId = response.body.message.id;
          response.body.success.should.equal(true);
          response.body.message.access.should.equal('public');
          done();
        });
    });

    it('should be able create a public document with an id', (done) => {
      app.post('/api/v1/documents')
      .send(testData.validUser6Document)
      .set({ 'x-access-token': regularUserToken })
        .end((error, response) => {
          response.body.success.should.equal(true);
          response.body.message.should.have.property('id');
          done();
        });
    });
  });

  describe('Get Document: ', () => {
    it('should get a private document for an admin', (done) => {
      app.get(`/api/v1/documents/${privateRegularUserDocumentId}`)
      .set({ 'x-access-token': adminToken })
        .end((error, response) => {
          response.status.should.equal(200);
          response.body.success.should.equal(true);
          response.body.document.should.have.property('id');
          response.body.document.should.have.property('title');
          done();
        });
    });

    it('should get a public document for an admin', (done) => {
      app.get(`/api/v1/documents/${publicRegularUserDocumentId}`)
      .set({ 'x-access-token': adminToken })
        .end((error, response) => {
          response.status.should.equal(200);
          response.body.success.should.equal(true);
          response.body.document.should.have.property('id');
          response.body.document.should.have.property('title');
          done();
        });
    });

    it(`should not return private documents to a regular user
    who does not own the document`, (done) => {
      app.get(`/api/v1/documents/${privateRegularUserDocumentId}`)
      .set({ 'x-access-token': regularUser1Token })
        .end((err, res) => {
          res.status.should.equal(401);
          res.body.message.should
          .equal('You don\'t have authorization to perform this action');
          done();
        });
    });

    it('should not get documents for a non logged in users', (done) => {
      app.get(`/api/v1/documents/${privateRegularUserDocumentId}`)
        .end((err, res) => {
          res.status.should.equal(403);
          res.body.message.should.equal('No token provided.');
          done();
        });
    });

    it('should return not found for a document not created', (done) => {
      app.get('/api/v1/documents/122')
      .set({ 'x-access-token': adminToken })
        .end((err, res) => {
          res.status.should.equal(404);
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
          response.body.success.should.equal(true);
          response.body.documents.should.have.property('count');
          response.body.documents.should.have.property('rows');
          done();
        });
    });

    it('should not allow a regular user to get all documents', (done) => {
      app.get('/api/v1/documents/')
      .set({ 'x-access-token': regularUserToken })
        .end((error, response) => {
          response.status.should.equal(401);
          response.body.success.should.equal(false);
          response.body.message.should
          .equal('You don\'t have authorization to perform this action');
          done();
        });
    });

    it('should get public documents for an admin', (done) => {
      app.get('/api/v1/documents?access=public')
      .set({ 'x-access-token': adminToken })
        .end((error, response) => {
          const documents = response.body.documents.rows;
          let allPublic = true;
          for (const document of documents) {
            if (document.access !== 'public') {
              allPublic = false;
              return false;
            }
          }
          response.status.should.equal(200);
          response.body.success.should.equal(true);
          allPublic.should.equal(true);
          done();
        });
    });
    it('should get private documents for an admin', (done) => {
      app.get('/api/v1/documents?access=private')
      .set({ 'x-access-token': adminToken })
        .end((error, response) => {
          const documents = response.body.documents.rows;
          let allPrivate = true;
          for (const document of documents) {
            if (document.access !== 'private') {
              allPrivate = false;
              return false;
            }
          }
          response.status.should.equal(200);
          response.body.success.should.equal(true);
          allPrivate.should.equal(true);
          done();
        });
    });

    it('should limit number of documents per request to ten or below',
    (done) => {
      app.get('/api/v1/documents')
      .set({ 'x-access-token': adminToken })
        .end((error, response) => {
          const documentLength = response.body.documents.rows.length;
          response.status.should.equal(200);
          response.body.success.should.equal(true);
          documentLength.should.belowOrEqual(10);
          done();
        });
    });

    it('should be able to limit the number of documents returned',
    (done) => {
      app.get('/api/v1/documents?limit=2')
      .set({ 'x-access-token': adminToken })
        .end((error, response) => {
          const documentLength = response.body.documents.rows.length;
          response.status.should.equal(200);
          response.body.success.should.equal(true);
          documentLength.should.equal(2);
          done();
        });
    });

    it('should be able to set an offset for documents returned',
    (done) => {
      app.get('/api/v1/documents?offset=1')
      .set({ 'x-access-token': adminToken })
        .end((error, response) => {
          const count = response.body.documents.count;
          const documentLength = response.body.documents.rows.length;
          response.status.should.equal(200);
          response.body.success.should.equal(true);
          documentLength.should.equal(count - 1);
          done();
        });
    });
  });


  describe('Update Documents: ', () => {
    it('should edit a document the user has access to.', (done) => {
      app.patch(`/api/v1/documents/${publicRegularUserDocumentId}`)
      .send({
        title: 'Hello world are you here',
      })
      .set({ 'x-access-token': regularUserToken })
        .end((error, response) => {
          response.status.should.equal(201);
          response.body.success.should.equal(true);
          response.body.message.title.should
          .equal('Hello world are you here');
          done();
        });
    });

    it('should not edit a document the user has no access to.', (done) => {
      app.patch(`/api/v1/documents/${publicRegularUserDocumentId}`)
      .send({
        title: 'Hello world are you here',
      })
      .set({ 'x-access-token': regularUser1Token })
        .end((error, response) => {
          response.status.should.equal(401);
          response.body.success.should.equal(false);
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
          response.body.success.should.equal(false);
          done();
        });
    });

    it('should not allow update for an unathorized request', (done) => {
      app.patch(`/api/v1/documents/${privateRegularUserDocumentId}`)
      .send({
        title: 'hmmm say something'
      })
      .end((error, response) => {
        response.status.should.equal(403);
        response.body.success.should.equal(false);
        response.body.message.should.equal('No token provided.');
        done();
      });
    });

    it('should not allow update if the request id is invalid.', (done) => {
      app.patch('/api/v1/documents/hello')
      .send({
        title: 'Hello world are you here',
      })
      .set({ 'x-access-token': regularUser1Token })
        .end((error, response) => {
          response.status.should.equal(406);
          response.body.success.should.equal(false);
          response.body.message.should
          .equal('parameter supplied should be a number');
          done();
        });
    });

    it('should not edit a document if the update title is invalid.', (done) => {
      app.patch(`/api/v1/documents/${publicRegularUserDocumentId}`)
      .send({
        title: '2ello world are you here',
      })
      .set({ 'x-access-token': regularUserToken })
        .end((error, response) => {
          response.status.should.equal(500);
          response.body.success.should.equal(false);
          response.body.message.should
          .equal('Validation error: The document title must start with a letter\
 and be 3 - 255 characters long can also contain spaces or hyphens.');
          done();
        });
    });

    it('should not edit a document if the update excerpt is invalid.',
    (done) => {
      app.patch(`/api/v1/documents/${publicRegularUserDocumentId}`)
      .send({
        excerpt: '¬¬¬¬¬¬',
      })
      .set({ 'x-access-token': regularUserToken })
        .end((error, response) => {
          response.status.should.equal(500);
          response.body.success.should.equal(false);
          response.body.message.should
          .equal('Validation error: The excerpt should only contain \
alpha-numeric characters.');
          done();
        });
    });

    it('should not edit a document if the update content is invalid.',
    (done) => {
      app.patch(`/api/v1/documents/${publicRegularUserDocumentId}`)
      .send({
        content: '¬¬¬¬¬¬',
      })
      .set({ 'x-access-token': regularUserToken })
        .end((error, response) => {
          response.status.should.equal(500);
          response.body.success.should.equal(false);
          response.body.message.should
          .equal('Validation error: The content should only contain \
alpha-numeric characters.');
          done();
        });
    });

    it('should not edit a document if the update content contains html.',
    (done) => {
      app.patch(`/api/v1/documents/${publicRegularUserDocumentId}`)
      .send({
        content: 'hello how are<script> hello world</script>',
      })
      .set({ 'x-access-token': regularUserToken })
        .end((error, response) => {
          response.status.should.equal(500);
          response.body.success.should.equal(false);
          response.body.message.should
          .equal('Document content contains dissallowed markup');
          done();
        });
    });

    it('should not edit a document if the update excerpt contains html.',
    (done) => {
      app.patch(`/api/v1/documents/${publicRegularUserDocumentId}`)
      .send({
        excerpt: 'hello how are<script> hello world</script>',
      })
      .set({ 'x-access-token': regularUserToken })
        .end((error, response) => {
          response.status.should.equal(500);
          response.body.success.should.equal(false);
          response.body.message.should
          .equal('Document excerpt contains dissallowed markup');
          done();
        });
    });

    it('should not edit a document if the update content is empty.',
    (done) => {
      app.patch(`/api/v1/documents/${publicRegularUserDocumentId}`)
      .send({
        content: '',
      })
      .set({ 'x-access-token': regularUserToken })
        .end((error, response) => {
          response.status.should.equal(500);
          response.body.success.should.equal(false);
          done();
        });
    });
  });

  describe('User\'s document: ', () => {
    it('should return all documents to the owner', (done) => {
      app.get(`/api/v1/documents/user/${regularUserId}`)
      .set({ 'x-access-token': regularUserToken })
        .end((error, response) => {
          response.status.should.equal(200);
          response.body.documents.should.be.an.Object();
          done();
        });
    });

    it(`should return all documents for a particular user
    to an admin`, (done) => {
      app.get(`/api/v1/documents/user/${regularUserId}`)
      .set({ 'x-access-token': adminToken })
        .end((error, response) => {
          response.status.should.equal(200);
          response.body.documents.should.be.a.Object();
          done();
        });
    });

    it(`should return error if
    user is not an admin or the owner of the document`, (done) => {
      app.get(`/api/v1/documents/user/${regularUserId}`)
      .set({ 'x-access-token': regularUser1Token })
        .end((error, response) => {
          response.status.should.equal(401);
          response.body.success.should.equal(false);
          response.body.message.should
          .equal('You don\'t have authorization for this action');
          done();
        });
    });

    it('should return error if user is not logged in', (done) => {
      app.get(`/api/v1/documents/user/${regularUserId}`)
        .end((error, response) => {
          response.status.should.equal(403);
          response.body.success.should.equal(false);
          response.body.message.should
          .equal('No token provided.');
          done();
        });
    });
  });

  describe('Delete: ', () => {
    it('should allow a regular user delete their document', (done) => {
      app.delete(`/api/v1/documents/${privateRegularUserDocumentId}`)
      .set({ 'x-access-token': regularUserToken })
        .end((error, response) => {
          response.status.should.equal(200);
          response.body.message.should
          .equal(`Delete Successful! Document with \
ìd:${privateRegularUserDocumentId} deleted`);
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
      app.delete(`/api/v1/documents/${publicRegularUserDocumentId}`)
      .set({ 'x-access-token': regularUser1Token })
        .end((error, response) => {
          response.status.should.equal(401);
          response.body.success.should.equal(false);
          response.body.message.should
          .equal('You don\'t have authorization to perform this action');
          done();
        });
    });

    it('should allow an admin to delete any document', (done) => {
      app.delete(`/api/v1/documents/${publicRegularUserDocumentId}`)
      .set({ 'x-access-token': adminToken })
        .end((error, response) => {
          response.status.should.equal(200);
          response.body.message.should
          .equal(`Delete Successful! Document with \
ìd:${publicRegularUserDocumentId} deleted`);
          done();
        });
    });

    it('should fail if user is not authorized', (done) => {
      app.delete(`/api/v1/documents/${publicRegularUserDocumentId}`)
        .end((error, response) => {
          response.status.should.equal(403);
          response.body.success.should.equal(false);
          response.body.message.should
          .equal('No token provided.');
          done();
        });
    });
  });
});

