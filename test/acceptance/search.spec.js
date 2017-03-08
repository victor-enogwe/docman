import helper from '../helpers/index.helpers';
import db     from '../../server/models';

const app = helper.app;
const testData = helper.testData;
let adminToken, regularUserToken, regularUser;

describe('Search', () => {
  before((done) => {
    app.post('/login')
    .send({
      username: testData.adminUser.username,
      password: testData.adminUser.password
    })
    .then((response) => {
      adminToken = response.body.data.token;
      testData.userDocument.creatorId = 1;
      db.Document.create(testData.userDocument)
      .then(() => {
        app.post('/api/v1/users')
        .send(testData.validUser)
        .then((res) => {
          regularUser = res.body.data.user;
          app.post('/login')
          .send({
            username: testData.validUser.username,
            password: testData.validUser.password
          })
          .then((res) => {
            regularUserToken = res.body.data.token;
            testData.userDocument.creatorId = regularUser.id;
            db.Document.create(testData.userDocument)
            .then(() => {
              testData.userDocument.access = 'public';
              db.Document.create(testData.userDocument)
              .then(() => done());
            });
          });
        });
      });
    });
  });

  after(() => db.User.destroy({ where: { roleId: 1 } })
  .then(() => db.Document.destroy({ where: {} })));

  describe('Documents: ', () => {
    it('should return documents for search', (done) => {
      app.get(`/api/v1/search/documents?phrase=${testData.userDocument.title}`)
      .set({ 'x-access-token': adminToken })
      .end((error, response) => {
        response.status.should.equal(200);
        response.body.status.should.equal('success');
        response.body.data.results.count.should.be.aboveOrEqual(1);
        done();
      });
    });

    it('should only allow search queries above 4 characters',
    (done) => {
      app.get('/api/v1/search/documents?phrase=22')
      .set({ 'x-access-token': adminToken })
      .end((error, response) => {
        response.status.should.equal(400);
        response.body.status.should.equal('fail');
        response.body.message.should
        .equal('Query phrase parameter length should be greater than 4.');
        done();
      });
    });

    it('should only accept alphanumeric characters for search query ****',
    (done) => {
      app.get('/api/v1/search/documents?phrase=****')
      .set({ 'x-access-token': adminToken })
      .end((error, response) => {
        response.status.should.equal(400);
        response.body.status.should.equal('fail');
        response.body.message.should
        .equal('Query phrase parameter can only be aplhanumeric.');
        done();
      });
    });

    it('should not return documents if query does not match any document',
    (done) => {
      app.get('/api/v1/search/documents?phrase=soloing')
      .set({ 'x-access-token': adminToken })
      .end((error, response) => {
        response.status.should.equal(404);
        response.body.status.should.equal('fail');
        response.body.message.should
        .equal('no results found for your query soloing');
        done();
      });
    });

    it('should not allow query access that is not public, private or role',
    (done) => {
      app.get('/api/v1/search/documents?phrase=soloing&access=rule')
      .set({ 'x-access-token': adminToken })
      .end((error, response) => {
        response.status.should.equal(400);
        response.body.status.should.equal('fail');
        response.body.message.should
        .equal('Query access can only be public, private or user.');
        done();
      });
    });

    it('should not allow a non integer id parameter for user search',
    (done) => {
      app.get('/api/v1/search/documents/user/dd?phrase=soloing')
      .set({ 'x-access-token': adminToken })
      .end((error, response) => {
        response.status.should.equal(400);
        response.body.status.should.equal('fail');
        response.body.message.should
        .equal('parameter id can only be a positive number greater than 0.');
        done();
      });
    });

    it('should search user documents if id parameter is supplied',
    (done) => {
      const title = testData.userDocument.title;
      app
      .get(`/api/v1/search/documents/user/1?phrase=${title}`)
      .set({ 'x-access-token': adminToken })
      .end((error, response) => {
        const status = response.status === 404 || response.status === 200;
        status.should.equal(true);
        done();
      });
    });

    it('should allow a regular user search for their documents',
    (done) => {
      const title = testData.userDocument.title;
      app
      .get(`/api/v1/search/documents/user/1?phrase=${title}`)
      .set({ 'x-access-token': regularUserToken })
      .then((response) => {
        response.body.status.should.equal('success');
        response.body.data.results.count.should.be.aboveOrEqual(1);
        done();
      });
    });

    it('should allow a regular user search all documents',
    (done) => {
      const title = testData.userDocument.title;
      app
      .get(`/api/v1/search/documents?phrase=${title}`)
      .set({ 'x-access-token': regularUserToken })
      .end((error, response) => {
        response.body.status.should.equal('success');
        response.body.data.results.count.should.be.aboveOrEqual(1);
        done();
      });
    });

    it('should allow a regular user search other users accessible documents',
    (done) => {
      const title = testData.userDocument.title;
      app
      .get(`/api/v1/search/documents/users/1?phrase=${title}`)
      .set({ 'x-access-token': regularUserToken })
      .end((error, response) => {
        const status = response.status === 404 || response.status === 200;
        status.should.equal(true);
        done();
      });
    });

    it('should allow a regular user search other users accessible documents',
    (done) => {
      const title = testData.userDocument.title;
      app
      .get(`/api/v1/search/documents/users/
${regularUser.id}?phrase=${title.substring(0, 9)}`)
      .set({ 'x-access-token': regularUserToken })
      .end((error, response) => {
        const status = response.status === 404 || response.status === 200;
        status.should.equal(true);
        done();
      });
    });

    it('should search user documents if access parameter is supplied',
    (done) => {
      const title = testData.userDocument.title;
      app
      .get(`/api/v1/search/documents/user/1?phrase=${title}&access=public`)
      .set({ 'x-access-token': adminToken })
      .end((error, response) => {
        const status = response.status === 404 || response.status === 200;
        status.should.equal(true);
        done();
      });
    });

    it('should search user documents if access parameter is supplied',
    (done) => {
      const title = testData.userDocument.title;
      app
      .get(`/api/v1/search/documents/user/1?phrase=${title}&access=private`)
      .set({ 'x-access-token': adminToken })
      .end((error, response) => {
        const status = response.status === 404 || response.status === 200;
        status.should.equal(true);
        done();
      });
    });

    it('should search user documents if access parameter is supplied',
    (done) => {
      const title = testData.userDocument.title;
      app
      .get(`/api/v1/search/documents/user/1?phrase=${title}&access=user`)
      .set({ 'x-access-token': adminToken })
      .end((error, response) => {
        const status = response.status === 404 || response.status === 200;
        status.should.equal(true);
        done();
      });
    });

    it('should not search if query phrase is not supplied',
    (done) => {
      app.get('/api/v1/search/documents')
      .set({ 'x-access-token': adminToken })
      .end((error, response) => {
        response.status.should.equal(400);
        response.body.status.should.equal('fail');
        response.body.message.should
        .equal('Please supply a query phrase parameter.');
        done();
      });
    });
  });

  describe('Users: ', () => {
    it('should search for users',
    (done) => {
      app.get('/api/v1/search/users?user=admin')
      .set({ 'x-access-token': adminToken })
      .end((error, response) => {
        response.status.should.equal(200);
        response.body.status.should.equal('success');
        response.body.data.results.count.should.be.aboveOrEqual(1);
        done();
      });
    });

    it('should require search query parameter user',
    (done) => {
      app.get('/api/v1/search/users')
      .set({ 'x-access-token': adminToken })
      .end((error, response) => {
        response.status.should.equal(400);
        response.body.status.should.equal('fail');
        response.body.message.should
        .equal('Please supply a search query parameter for user.');
        done();
      });
    });

    it('should not allow a regular user access to search',
    (done) => {
      app.get('/api/v1/search/users')
      .set({ 'x-access-token': regularUserToken })
      .end((error, response) => {
        response.status.should.equal(401);
        response.body.status.should.equal('fail');
        response.body.message.should
        .equal('You don\'t have authorization to perform this action');
        done();
      });
    });
  });
});
