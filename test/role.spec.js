 import helper    from './helpers/index.helpers';

const supertest = helper.supertest;
const should = helper.should;
const server= supertest(helper.app);

let adminToken, regularUserToken, newRoleId, newRoleTitle;

describe('Roles:', () => {
  before((done) => {
    server.post('/users')
    .send(testData.adminUserRole)
    .end((error, res) => {
      adminToken = res.body.token;
      server.post('/users')
      .send(testData.regularUserRole)
      .end((error1, res) => {
        regularUserToken = res.body.token;
        done();
      });
    });
  });

  describe('Create Role', () => {
    it('should allow an Admin user with VALID token create a Role',
    (done) => {
      server.post('/roles')
      .set({ 'x-access-token': adminToken })
      .send(testData.newRole1)
      .end((error, res) => {
        should(res.status).equal(201);
        newRoleId = res.body.id;
        newRoleTitle = res.body.title;
        should(newRoleTitle).equal(testData.newRole1.title);
        done();
      });
    });

    it(`should NOT allow an Admin user with VALID token create a
     DUPLICATE Role`,
    (done) => {
      server.post('/roles')
      .set({ 'x-access-token': adminToken })
      .send(testData.duplicateRole1)
      .end((error, res) => {
        should(res.status).equal(400);
        done();
      });
    });

    it(`should NOT allow any User with an INVALID token 
    create a Role`,
    (done) => {
      server.post('/roles')
      .set({ 'x-access-token': 'invalid token' })
      .send(testData.newRole2)
      .end((error, res) => {
        should(res.status).equal(403);
        done();
      });
    });

    it(`should NOT allow a NON-Admin User with a VALID token 
    create a Role`,
    (done) => {
      server.post('/roles')
      .set({ 'x-access-token': regularUserToken })
      .send(testData.newRole3)
      .end((error, res) => {
        should(res.status).equal(403);
        done();
      });
    });
  });

  describe('Update Role', () => {
    it('should allow only an Admin user with VALID token UPDATE a Role',
    (done) => {
      server.put(`/roles/${newRoleId}`)
      .set({ 'x-access-token': adminToken })
      .send(testData.updateRole1)
      .end((error, res) => {
        should(res.status).equal(200);
        should(res.body.title).equal(testData.updateRole1.title);
        done();
      });
    });

    it('should return not found for a not-existing role', (done) => {
      server.put(`/roles/${newRoleId + 300}`)
      .set({ 'x-access-token': adminToken })
      .send(testData.updateRole1)
      .end((error, res) => {
        should(res.status).equal(404);
        should(res.body.success).equal(false);
        done();
      });
    });

    it(`should NOT allow any User (Admin, Regular...) with an INVALID token 
    UPDATE a Role`,
    (done) => {
      server.put(`/roles/${newRoleId}`)
      .set({ 'x-access-token': 'invalid token' })
      .send(testData.updateRole1)
      .end((error, res) => {
        should(res.status).equal(403);
        done();
      });
    });

    it(`should NOT allow a NON-Admin User with a VALID token 
    UPDATE a Role`,
    (done) => {
      server.put(`/roles/${newRoleId}`)
      .set({ 'x-access-token': regularUserToken })
      .send(testData.updateRole1)
      .end((error, res) => {
        should(res.status).equal(403);
        done();
      });
    });
  });

  describe('Get', () => {
    it('should allow an Admin User with VALID token get all Roles',
    (done) => {
      server.get('/roles')
      .set({ 'x-access-token': adminToken })
      .end((error, res) => {
        should(res.status).equal(200);
        res.body.should.be.a.Array();
        done();
      });
    });

    it('should validate that atleast "regular" and "admin" roles exist',
    (done) => {
      server.get('/roles')
      .set({ 'x-access-token': adminToken })
      .end((error, res) => {
        should(res.status).equal(200);
        should(res.body[0].id).equal(1);
        should(res.body[0].title).equal('admin');
        should(res.body[1].id).equal(2);
        should(res.body[1].title).equal('regular');
        done();
      });
    });

    it(`should NOT allow any User (Admin, Regular, ...) with an INVALID 
    token to get all Roles`, (done) => {
      server.get('/roles')
      .set({ 'x-access-token': 'invalid token' })
      .end((error, res) => {
        should(res.status).equal(403);
        done();
      });
    });

    it('should NOT allow a Non-Admin User with VALID token get all Roles',
    (done) => {
      server.get('/roles')
      .set({ 'x-access-token': regularUserToken })
      .end((error, res) => {
        should(res.status).equal(403);
        done();
      });
    });

    it('should allow an Admin User with VALID token get a Role',
    (done) => {
      server.get(`/roles/${newRoleId}`)
      .set({ 'x-access-token': adminToken })
      .end((error, res) => {
        should(res.status).equal(200);
        done();
      });
    });

    it('should allow an Admin User with VALID token get a NON-EXISTENT Role',
    (done) => {
      server.get(`/roles/${newRoleId + 90}`)
      .set({ 'x-access-token': adminToken })
      .end((error, res) => {
        should(res.status).equal(404);
        done();
      });
    });
  });

  describe('Delete Roles', () => {
    it('should NOT allow a Non-Admin User with VALID token to delete a role',
    (done) => {
      server.delete(`/roles/${newRoleId}`)
      .set({ 'x-access-token': regularUserToken })
      .end((error, res) => {
        should(res.status).equal(403);
        done();
      });
    });

    it('should allow an Admin User with VALID token delete a Role',
    (done) => {
      server.delete(`/roles/${newRoleId}`)
      .set({ 'x-access-token': adminToken })
      .end((error, res) => {
        should(res.status).equal(200);
        done();
      });
    });

    it(`should return not found 
    when an Admin User tries to delete a NON-EXISTENT Role`,
    (done) => {
      server.delete(`/roles/${newRoleId + 90}`)
      .set({ 'x-access-token': adminToken })
      .end((error, res) => {
        should(res.status).equal(404);
        done();
      });
    });
  });
});
