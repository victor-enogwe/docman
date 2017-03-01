import helper from './helpers/index.helpers';

const app = helper.app;
const testData = helper.testData;
let adminToken;


describe('Search', () => {
  it('should return documents limited by a specified number', (done) => {
    app.post('/login')
    .send({
      username: testData.adminUser.username,
      password: testData.adminUser.password
    })
    .end((error, response) => {
      adminToken = response.body.token;
      app.post('/api/v1/documents')
      .set({ 'x-access-token': adminToken })
      .send(testData.validUser6Document)
      .end((err, res) => {
        if (res.body.success === true) {
          app.get('/api/v1/documents/?limit=6')
          .set({ 'x-access-token': adminToken })
          .end((err, res) => {
            res.status.should.equal(200);
            res.body.success.should.equal(true);
            res.body.documents.count.should.be.belowOrEqual(6);
            done();
          });
        }
      });
    });
  });

  // it('should return documents ordered by published date in descending order',
  // (done) => {
  //   app.get('/api/documents/')
  //   .set({ 'x-access-token': adminToken })
  //   .end((error, response) => {
  //     expect(response.status).to.equal(200);
  //     let oldestDate = Date.now();
  //     response.body.documents.forEach((document) => {
  //       const createdDate = Date.parse(document.createdAt);
  //       expect(createdDate).to.be.lte(oldestDate);
  //       oldestDate = createdDate;
  //     });
  //     done();
  //   });
  // });

  // it('should return only documents that match a specific query', (done) => {
  //   const searchText = testDocument.title.split(/\s/)[0];
  //   app.get(`/api/documents/?search=${searchText}`)
  //   .set({ 'x-access-token': adminUserToken })
  //   .end((error, response) => {
  //     expect(response.status).to.equal(200);
  //     response.body.documents.forEach((document) => {
  //       expect(document.title).to.contain(searchText) ||
  //       expect(document.content).to.contain(searchText);
  //     });
  //     done();
  //   });
  // });
});
