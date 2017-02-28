// import helper    from './helpers/index.helpers';

// const app = helper.app;
// const testData = helper.testData;
// let adminToken;

// before((done) => {
//   db.sequelize.sync()
//   .then(() => {
//     db.User.destroy({
//       where: {
//         roleId: 1
//       }
//     }).then(() => {
//       db.Document.destroy({ where: {} })
//       .then(() => {
//         app.post('/api/v1/users')
//         .send(testData.validUser6)
//         .end((err, res) => {
//           regularUserId = res.body.message.id;
//           testData.validUser6Document.creatorId = regularUserId;
//           app.post('/login')
//           .send({
//             username: testData.validUser6.username,
//             password: testData.validUser6.password
//           })
//           .end((error, response) => {
//             regularUserToken = response.body.token;
//             app.post('/login')
//             .send({
//               username: testData.adminUser.username,
//               password: testData.adminUser.password
//             })
//             .end((err, res) => {
//               if (!err) {
//                 adminToken = res.body.token;
//                 app.post('/api/v1/users')
//                 .send(testData.validUser7)
//                 .end((err, res) => {
//                   if (!err) {
//                     regularUser1Id = res.body.message.Id;
//                     app.post('/login')
//                     .send({
//                       username: testData.validUser7.username,
//                       password: testData.validUser7.password
//                     })
//                     .end((err, res) => {
//                       if (!err) regularUser1Token = res.body.token;
//                       done();
//                     });
//                   }
//                 });
//               }
//             });
//           });
//         });
//       });
//     });
//   });
// });

// before((done) => {
//   app.post('/login')
//   .send({
//     username: testData.adminUser.username,
//     password: testData.adminUser.password
//   })
//   .end((error, response) => {
//     adminToken = response.body.token;
//     app.post('/api/documents')
//     .set({ 'x-access-token': adminToken })
//     .send(testData.validUser6Document)
//     .end(() => done());
//   });
// });

// describe('Search', () => {
//   it('should return documents limited by a specified number', (done) => {
//     const searchLimit = 3;
//     app.get(`/api/documents/?limit=${searchLimit}`)
//     .set({ 'x-access-token': adminToken })
//     .end((error, response) => {
//       response.status.should.equal(200);
//       response.body.documents.length.should.equal(searchLimit);
//       done();
//     });
//   });

//   it('should return documents ordered by published date in descending order',
//   (done) => {
//     app.get('/api/documents/')
//     .set({ 'x-access-token': adminUserToken })
//     .end((error, response) => {
//       expect(response.status).to.equal(200);
//       let oldestDate = Date.now();
//       response.body.documents.forEach((document) => {
//         const createdDate = Date.parse(document.createdAt);
//         expect(createdDate).to.be.lte(oldestDate);
//         oldestDate = createdDate;
//       });
//       done();
//     });
//   });

//   it('should return only documents that match a specific query', (done) => {
//     const searchText = testDocument.title.split(/\s/)[0];
//     app.get(`/api/documents/?search=${searchText}`)
//     .set({ 'x-access-token': adminUserToken })
//     .end((error, response) => {
//       expect(response.status).to.equal(200);
//       response.body.documents.forEach((document) => {
//         expect(document.title).to.contain(searchText) ||
//         expect(document.content).to.contain(searchText);
//       });
//       done();
//     });
//   });
// });
