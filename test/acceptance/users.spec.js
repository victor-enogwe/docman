import helper from '../helpers/index.helpers';
import db     from '../../server/models';

const app = helper.app;
const testData = helper.testData;
let regularUser, adminToken, regularUserToken;


describe('Users:', () => {
  after(() => db.User.destroy({ where: { roleId: 1 } }));

  describe('Create Regular User', () => {
    it('Should return http code 201 if a Regular User is created', (done) => {
      app.post('/api/v1/users')
      .send(testData.validUser)
      .end((error, response) => {
        regularUser = response.body.data.user;
        response.status.should.equal(201);
        done();
      });
    });

    it('Should ensure that a new user has a roleId', () => {
      regularUser.should.have.property('roleId').equal(1);
    });

    it('Should ensure that a new user has a firstname', () => {
      regularUser.should.have.property('firstname');
    });

    it('Should ensure that a new user has a lastname', () => {
      regularUser.should.have.property('lastname');
    });

    it('Should ensure that a new user has a username', () => {
      regularUser.should.have.property('username');
    });

    it('Should not allow duplicate username in the database', (done) => {
      app.post('/api/v1/users')
      .send(testData.validUser)
      .end((error, response) => {
        response.status.should.equal(400);
        response.body.status.should.equal('fail');
        response.body.message.should
        .equal('Oops. There is an existing account with this username.');
        done();
      });
    });

    it('Should not allow duplicate email in the database', (done) => {
      testData.validUser.username = 'folashade';
      app.post('/api/v1/users')
      .send(testData.validUser)
      .end((error, response) => {
        response.status.should.equal(400);
        response.body.status.should.equal('fail');
        response.body.message.should
        .equal('Oops. There is an existing account with this email address.');
        done();
      });
    });

    it(`Should disallow user creation if the password does not match
password confirmation`,
    (done) => {
      testData.validUser.password_confirmation = 'ccvc';
      app.post('/api/v1/users')
      .send(testData.validUser)
      .end((error, response) => {
        response.status.should.equal(400);
        response.body.status.should.equal('fail');
        response.body.message.should
        .equal('Password confirmation does not match password');
        done();
      });
    });

    it('Should disallow user creation if request body contains invalid keys',
    (done) => {
      testData.validUser.use = 'hello';
      app.post('/api/v1/users')
      .send(testData.validUser)
      .end((error, response) => {
        const badKeys = '( use )';
        response.status.should.equal(400);
        response.body.status.should.equal('fail');
        response.body.message.should
        .equal(`badly formatted request body including ${badKeys}`);
        done();
      });
    });

    it('Should require a password of atleast eight characters', (done) => {
      testData.validUser.password = 'htc';
      delete testData.validUser.use;
      app.post('/api/v1/users')
      .send(testData.validUser)
      .end((error, response) => {
        response.status.should.equal(400);
        response.body.message.should
        .equal('Please choose a longer password');
        done();
      });
    });

    it('Should not allow roleId in request body during creation', (done) => {
      testData.validUser.roleId = '1';
      app.post('/api/v1/users')
      .send(testData.validUser)
      .end((error, response) => {
        response.status.should.equal(400);
        response.body.status.should.equal('fail');
        response.body.message.should
        .equal('badly formatted request body including ( roleId )');
        done();
      });
    });

    it('Should only allow usernames having more than 2 characters', (done) => {
      testData.validUser.username = 'ad';
      testData.validUser.password = 'fakeuser';
      testData.validUser.password_confirmation = 'fakeuser';
      delete testData.validUser.roleId;
      app.post('/api/v1/users')
      .send(testData.validUser)
      .end((error, response) => {
        response.status.should.equal(400);
        response.body.status.should.equal('fail');
        response.body.message.should
        .equal('Username must start with a letter, have no spaces, and \
be 3 - 40 characters long.');
        done();
      });
    });

    it('Should only allow usernames having less than 40 characters', (done) => {
      testData.validUser.username = testData.longTitle;
      app.post('/api/v1/users')
      .send(testData.validUser)
      .end((error, response) => {
        response.status.should.equal(400);
        response.body.message.should
        .equal('Username must start with a letter, have no spaces, and be \
3 - 40 characters long.');
        done();
      });
    });

    it('Should only allow firstnames having more than 2 characters', (done) => {
      testData.validUser.username = 'eliano';
      testData.validUser.firstname = 'el';
      testData.validUser.email = 'eliano@gmail.com';
      app.post('/api/v1/users')
      .send(testData.validUser)
      .end((error, response) => {
        response.status.should.equal(400);
        response.body.message.should
        .equal('Firstname must start with a letter, have no spaces, and be \
3 - 40 characters long.');
        done();
      });
    });

    it('Should only allow firstnames having less than 40 characters',
    (done) => {
      testData.validUser.firstname = testData.longTitle;
      app.post('/api/v1/users')
      .send(testData.validUser)
      .end((error, response) => {
        response.status.should.equal(400);
        response.body.message.should
        .equal('Firstname must start with a letter, have no spaces, and be \
3 - 40 characters long.');
        done();
      });
    });

    it('Should only allow lastnames having more than 2 characters', (done) => {
      testData.validUser.firstname = 'victor';
      testData.validUser.lastname = 'f';
      app.post('/api/v1/users')
      .send(testData.validUser)
      .end((error, response) => {
        response.status.should.equal(400);
        response.body.message.should
        .equal('Lastname must start with a letter, have no spaces, and be \
3 - 40 characters long.');
        done();
      });
    });

    it('Should only allow lastnames having less than 40 characters',
    (done) => {
      testData.validUser.lastname = testData.longTitle;
      app.post('/api/v1/users')
      .send(testData.validUser)
      .end((error, response) => {
        response.status.should.equal(400);
        response.body.message.should
        .equal('Lastname must start with a letter, have no spaces, and be \
3 - 40 characters long.');
        done();
      });
    });

    it('Should only allow valid emails',
    (done) => {
      testData.validUser.firstname = 'victor';
      testData.validUser.lastname = 'enogwe';
      testData.validUser.email = 'enogwe';
      app.post('/api/v1/users')
      .send(testData.validUser)
      .end((error, response) => {
        response.status.should.equal(400);
        response.body.message.should
        .equal('The email you entered is invalid.');
        done();
      });
    });

    it('Should only allow emails less than 254 characters',
    (done) => {
      testData.validUser.email = testData.longTitle;
      app.post('/api/v1/users')
      .send(testData.validUser)
      .end((error, response) => {
        response.status.should.equal(400);
        response.body.message.should
        .equal('The email you entered is invalid  and longer \
than 254 characters.');
        done();
      });
    });

    it('Should disallow user creation if password confirmation is empty',
    (done) => {
      testData.validUser.email = 'amelia@gmail.com';
      testData.validUser.password_confirmation = '';
      app.post('/api/v1/users')
      .send(testData.validUser)
      .end((error, response) => {
        response.status.should.equal(400);
        response.body.message.should
        .equal('Please confirm password');
        done();
      });
    });

    it('Should not return the security details of the created Regular User',
    () => {
      regularUser.should.not.have.property('password');
      regularUser.should.not.have.property('password_confirmation');
      regularUser.should.not.have.property('password_digest');
      regularUser.should.not.have.property('auth_token');
    });

    it('Should create a user without admin privileges', () => {
      regularUser.roleId.should.not.equal(0);
    });
  });

  describe('Login', () => {
    it('Should allow login for admin user with valid credentials', (done) => {
      app.post('/login')
      .send({
        email: testData.adminUser.email,
        password: testData.adminUser.password
      })
      .end((error, response) => {
        adminToken = response.body.data.token;
        response.status.should.equal(200);
        response.body.data.token.should.be.an.instanceof(String);
        done();
      });
    });

    it('Should disallow login for invalid admin user password', (done) => {
      app.post('/login')
      .send({
        email: testData.adminUser.email,
        password: 'invalidpassword'
      })
      .end((error, response) => {
        response.body.status.should.equal('fail');
        response.body.message.should
        .equal('Authentication failed! Wrong password.');
        done();
      });
    });

    it(`Should fail with message 'Authentication failed. User not found'.
if admin user does not exist`, (done) => {
      app.post('/login')
      .send({
        username: '00p',
        password: 'invalidpassword'
      })
      .end((error, response) => {
        response.body.status.should.equal('fail');
        response.body.message.should
        .equal('Authentication failed! User not found.');
        done();
      });
    });

    it('Should allow either username or passowrd login, not both for admin',
    (done) => {
      app.post('/login')
      .send({
        username: testData.adminUser.username,
        email: testData.adminUser.email,
        password: testData.adminUser.password
      })
      .end((error, response) => {
        response.body.status.should.equal('fail');
        response.body.message.should
        .equal('Please supply either user name or email, plus your password');
        done();
      });
    });

    it('Should return a token if the admin user login is successful',
    () => {
      adminToken.split('.').length.should.equal(3);
    });

    it('Should allow admin login with username',
    (done) => {
      app.post('/login')
      .send({
        username: testData.adminUser.username,
        password: testData.adminUser.password
      })
      .end((error, response) => {
        response.status.should.equal(200);
        response.body.data.should.have.property('token').which.is.a.String();
        response.body.data.token.split('.').length.should.equal(3);
        done();
      });
    });

    it('Should allow admin login with email',
    (done) => {
      app.post('/login')
      .send({
        email: testData.adminUser.email,
        password: testData.adminUser.password
      })
      .end((error, response) => {
        adminToken = response.body.data.token;
        response.status.should.equal(200);
        response.body.data.should.have.property('token').which.is.a.String();
        response.body.data.token.split('.').length.should.equal(3);
        done();
      });
    });

    it('Should not return a token if admin user login fails', (done) => {
      app.post('/login')
      .send({
        email: testData.adminUser.email,
        password: 'invaidpassword'
      })
      .end((error, response) => {
        response.status.should.equal(401);
        response.body.status.should.equal('fail');
        response.body.should.not.have.property('data');
        done();
      });
    });

    it('Should allow login for a regular user with email',
    (done) => {
      testData.validUser.username = 'amelia';
      testData.validUser.email = 'saitamalisby@gmail.com';
      testData.validUser.password = 'fakeuserpass';
      app.post('/login')
      .send({
        email: testData.validUser.email,
        password: testData.validUser.password
      })
      .end((error, response) => {
        response.status.should.equal(200);
        response.body.status.should.equal('success');
        response.body.data.should.have.property('token').which.is.a.String();
        done();
      });
    });

    it('Should allow login for a regular user with username',
    (done) => {
      app.post('/login')
      .send({
        username: testData.validUser.username,
        password: testData.validUser.password
      })
      .end((error, response) => {
        response.status.should.equal(200);
        response.body.status.should.equal('success');
        response.body.data.should.have.property('token').which.is.a.String();
        done();
      });
    });

    it('Should disallow login for invalid regular user password', (done) => {
      app.post('/login')
      .send({
        email: testData.validUser.email,
        password: 'invalidpassword'
      })
      .end((error, response) => {
        response.body.status.should.equal('fail');
        response.body.message.should
        .equal('Authentication failed! Wrong password.');
        response.body.should.not.have.property('data');
        done();
      });
    });

    it(`Should fail with message 'Authentication failed. User not found'.
if regular user does not exist`, (done) => {
      app.post('/login')
      .send({
        username: '00p',
        password: 'invalidpassword'
      })
      .end((error, response) => {
        response.body.status.should.equal('fail');
        response.body.message.should
        .equal('Authentication failed! User not found.');
        done();
      });
    });

    it('Should allow username or passowrd login, not both for regular users',
    (done) => {
      app.post('/login')
      .send({
        username: testData.validUser.username,
        email: testData.validUser.email,
        password: testData.validUser.password
      })
      .end((error, response) => {
        response.body.status.should.equal('fail');
        response.body.message.should
        .equal('Please supply either user name or email, plus your password');
        done();
      });
    });

    it('Should return a token if the regular user login is successful',
    (done) => {
      app.post('/login')
      .send({
        email: testData.validUser.email,
        password: testData.validUser.password
      })
      .end((error, response) => {
        regularUserToken = response.body.data.token;
        response.status.should.equal(200);
        response.body.data.should.have.property('token').which.is.a.String();
        response.body.data.token.split('.').length.should.equal(3);
        done();
      });
    });

    it('Should not return a token if regular user login fails', (done) => {
      app.post('/login')
      .send({
        email: testData.validUser.email,
        password: 'invaidpassword'
      })
      .end((error, response) => {
        response.status.should.equal(401);
        response.body.status.should.equal('fail');
        response.body.should.not.have.property('data');
        done();
      });
    });

    it('Should fail if login body includes any key other than username, \
password or email', (done) => {
      app.post('/login')
      .send({
        emailer: testData.validUser.email,
        password: 'invaidpassword'
      })
      .end((error, response) => {
        response.status.should.equal(401);
        response.body.status.should.equal('fail');
        response.body.message.should.equal('Please supply either user name\
 or email, plus your password');
        done();
      });
    });
  });

  describe('Get User', () => {
    it('Should deny access to users data if accessed without a token',
    (done) => {
      app.get('/api/v1/users/1')
      .end((error, response) => {
        response.status.should.equal(403);
        response.body.status.should.equal('fail');
        response.body.message.should
        .equal('No token provided.');
        done();
      });
    });

    it('Should deny access to user with token that doesn\'t match the stored \
auth token',
    (done) => {
      app.get('/api/v1/users/1')
      .set({ 'x-access-token': 'regular.User.Token' })
      .end((error, response) => {
        response.status.should.equal(401);
        response.body.status.should.equal('fail');
        response.body.message.should
        .equal('Failed to authenticate token.');
        done();
      });
    });

    it('Should not allow a non-admin access other users data', (done) => {
      app.get('/api/v1/users/1')
      .set({ 'x-access-token': regularUserToken })
      .end((error, response) => {
        response.status.should.equal(401);
        response.body.status.should.equal('fail');
        response.body.message.should
        .equal('You don\'t have authorization for this action');
        done();
      });
    });

    it('Should allow an admin user access to fetch any user data', (done) => {
      app.get(`/api/v1/users/${regularUser.id}`)
      .set({ 'x-access-token': adminToken })
      .end((error, response) => {
        response.status.should.equal(200);
        response.body.status.should.equal('success');
        response.body.data.user.should.have.property('id');
        response.body.data.user.should.have.property('username');
        response.body.data.user.should.have.property('roleId');
        response.body.data.user.should.have.property('firstname');
        response.body.data.user.should.have.property('lastname');
        response.body.data.user.should.have.property('email');
        done();
      });
    });

    it('Should allow a regular user access to fetch their user data',
    (done) => {
      app.get(`/api/v1/users/${regularUser.id}`)
      .set({ 'x-access-token': regularUserToken })
      .end((error, response) => {
        response.status.should.equal(200);
        response.body.status.should.equal('success');
        response.body.data.user.should.have.property('id');
        response.body.data.user.should.have.property('username');
        response.body.data.user.should.have.property('roleId');
        response.body.data.user.should.have.property('firstname');
        response.body.data.user.should.have.property('lastname');
        response.body.data.user.should.have.property('email');
        done();
      });
    });

    it('Should not return a user, if user with userId doesn\'t exist',
    (done) => {
      app.get('/api/v1/users/100000000')
      .set({ 'x-access-token': adminToken })
      .end((error, response) => {
        response.status.should.equal(404);
        response.body.status.should.equal('fail');
        response.body.message.should.equal('No user found');
        done();
      });
    });

    it('Should only allow valid numeric userid to be queried', (done) => {
      app.get('/api/v1/users/ab')
      .set({ 'x-access-token': adminToken })
      .end((error, response) => {
        response.status.should.equal(406);
        response.body.status.should.equal('fail');
        response.body.message.should
        .equal('parameter supplied should be a number');
        done();
      });
    });
  });

  describe('Get All Users: ', () => {
    it('Should not allow a non-admin access all users data', (done) => {
      app.get('/api/v1/users/')
      .set({ 'x-access-token': regularUserToken })
      .end((error, response) => {
        response.status.should.equal(401);
        response.body.status.should.equal('fail');
        response.body.message.should
        .equal('You don\'t have authorization to perform this action');
        done();
      });
    });

    it('Should allow an admin user access to fetch all users data', (done) => {
      app.get('/api/v1/users/')
      .set({ 'x-access-token': adminToken })
      .end((error, response) => {
        response.status.should.equal(200);
        response.body.status.should.equal('success');
        response.body.data.users.rows.should.be.an.instanceOf(Array);
        response.body.data.users.rows[0].should.have.property('id');
        response.body.data.users.rows[0].should.have.property('username');
        response.body.data.users.rows[0].should.have.property('roleId');
        response.body.data.users.rows[0].should.have.property('firstname');
        response.body.data.users.rows[0].should.have.property('lastname');
        response.body.data.users.rows[0].should.have.property('email');
        done();
      });
    });

    it('Should not find any user for offset data above the database rows',
    (done) => {
      app.get('/api/v1/users?offset=10&&limit=5')
      .set({ 'x-access-token': adminToken })
      .end((error, response) => {
        response.status.should.equal(404);
        response.body.status.should.equal('fail');
        response.body.message.should.equal('No user found');
        done();
      });
    });
  });

  describe('Update User: ', () => {
    it('Should not allow user update if an invalid id is supplied',
  (done) => {
    testData.validUser.lastname = 'hobnobs';
    app.patch('/api/v1/users/fffa')
    .set({ 'x-access-token': adminToken })
    .send(testData.validUser)
    .end((error, response) => {
      response.status.should.equal(406);
      response.body.status.should.equal('fail');
      response.body.message.should
      .equal('parameter supplied should be a number');
      done();
    });
  });

    it('Should not allow user update if the user does not exist',
    (done) => {
      app.patch('/api/v1/users/10000000')
      .set({ 'x-access-token': adminToken })
      .send(testData.validUser)
      .end((error, response) => {
        response.status.should.equal(404);
        response.body.status.should.equal('fail');
        response.body.message.should
        .equal('No user found');
        done();
      });
    });

    it('Should not allow user update if an invalid token is supplied',
  (done) => {
    app.patch(`/api/v1/users/${regularUser.id}`)
    .set({ 'x-access-token': 'regularUserToken' })
    .send(testData.validUser)
    .end((error, response) => {
      response.status.should.equal(401);
      response.body.status.should.equal('fail');
      response.body.message.should
      .equal('Failed to authenticate token.');
      done();
    });
  });

    it('Should not allow user update if no token is supplied',
  (done) => {
    app.patch(`/api/v1/users/${regularUser.id}`)
    .send(testData.validUser)
    .end((error, response) => {
      response.status.should.equal(403);
      response.body.status.should.equal('fail');
      response.body.message.should
      .equal('No token provided.');
      done();
    });
  });

    it('Should not allow regular users update another users profile',
    (done) => {
      testData.adminUser.lastname = 'Iamadmin';
      app.patch('/api/v1/users/1')
      .set({ 'x-access-token': regularUserToken })
      .send(testData.adminUser)
      .end((error, response) => {
        response.status.should.equal(401);
        response.body.status.should.equal('fail');
        response.body.message.should
        .equal('You don\'t have authorization for this action');
        done();
      });
    });

    it(`Should not allow user to update profile if invalid update 
fields are supplied`,
    (done) => {
      testData.validUser.invalidField = 'hello';
      app.patch(`/api/v1/users/${regularUser.id}`)
      .set({ 'x-access-token': regularUserToken })
      .send(testData.validUser)
      .end((error, response) => {
        response.status.should.equal(400);
        response.body.status.should.equal('fail');
        response.body.message.should
        .equal('badly formatted request body including ( invalidField )');
        done();
      });
    });

    it('Should Allow a User Update his profile if he has a valid Token',
    (done) => {
      const firstname = 'newName';
      app.patch(`/api/v1/users/${regularUser.id}`)
      .set({ 'x-access-token': regularUserToken })
      .send({
        firstname
      })
      .end((error, response) => {
        response.status.should.equal(201);
        response.body.data.user.firstname.should.equal('newname');
        done();
      });
    });

    it('Should NOT allow a User update his profile without a Valid Token',
    (done) => {
      app.patch(`/api/v1/users/${regularUser.id}`)
      .set({ 'x-access-token': 'invalidToken' })
      .end((error, response) => {
        response.status.should.equal(401);
        response.body.status.should.equal('fail');
        done();
      });
    });

    it('Should only allow user roleId update of 0 or 1 by admin', (done) => {
      app.patch(`/api/v1/users/${regularUser.id}`)
      .set({ 'x-access-token': adminToken })
      .send({ roleId: 3 })
      .end((error, response) => {
        response.status.should.equal(500);
        response.body.status.should.equal('error');
        response.body.message.should
        .equal('roleId can only be 0 or 1');
        done();
      });
    });

    it('Should only allow update of the roleId  of the default admin',
    (done) => {
      app.patch('/api/v1/users/1')
      .set({ 'x-access-token': adminToken })
      .send({ roleId: 1 })
      .end((error, response) => {
        response.status.should.equal(403);
        response.body.status.should.equal('fail');
        response.body.message.should
        .equal('You cannot change the default admin\'s role id');
        done();
      });
    });
  });

  describe('Delete User: ', () => {
    it('Should not allow a non-admin user to delete a user',
    (done) => {
      app.delete(`/api/v1/users/${regularUser.id}`)
      .set({ 'x-access-token': regularUserToken })
      .end((error, response) => {
        response.status.should.equal(401);
        response.body.status.should.equal('fail');
        response.body.message.should
        .equal('You don\'t have authorization to perform this action');
        done();
      });
    });

    it('Should not allow an admin user with an in-Valid token delete a user',
    (done) => {
      app.delete(`/api/v1/users/${regularUser.id}`)
      .set({ 'x-access-token': 'invalidToken' })
      .end((error, response) => {
        response.status.should.equal(401);
        response.body.status.should.equal('fail');
        response.body.message.should.equal('Failed to authenticate token.');
        done();
      });
    });

    it('Should allow an admin user with a valid token to delete any user',
    (done) => {
      app.delete(`/api/v1/users/${regularUser.id}`)
      .set({ 'x-access-token': adminToken })
      .end((error, response) => {
        response.status.should.equal(200);
        response.body.status.should.equal('success');
        response.body.message.should
        .equal(`Delete Successful! User witn ìd:${regularUser.id} deleted`);
        done();
      });
    });

    it('Should not allow the deletion of the default admin account',
    (done) => {
      app.delete('/api/v1/users/1')
      .set({ 'x-access-token': adminToken })
      .end((error, response) => {
        response.status.should.equal(403);
        response.body.status.should.equal('fail');
        response.body.message.should
        .equal('You cannot delete the default admin account');
        done();
      });
    });

    it('Should return a user does not exist message if admin tries to \
delete a non existing user', (done) => {
      app.delete(`/api/v1/users/${regularUser.id}`)
      .set({ 'x-access-token': adminToken })
      .end((error, response) => {
        response.status.should.equal(404);
        response.body.status.should.equal('fail');
        response.body.message.should
        .equal(`Delete Failed! User witn ìd:${regularUser.id} \
Not found`);
        done();
      });
    });

    it('should deny access to a user that has been deleted',
    (done) => {
      app.get(`/api/v1/users/${regularUser.id}`)
      .set({ 'x-access-token': regularUserToken })
      .end((error, response) => {
        response.status.should.equal(404);
        response.body.status.should.equal('fail');
        response.body.message.should
        .equal('This user does not exist anymore.');
        done();
      });
    });
  });

  describe('Logout', () => {
    it('should successfully logout a user with a valid token',
    (done) => {
      app.post('/logout')
      .set({ 'x-access-token': adminToken })
      .end((error, response) => {
        response.status.should.equal(200);
        response.body.status.should.equal('success');
        response.body.message.should.equal('you are now logged out');
        done();
      });
    });

    it('should fail to logout a user with an invalid token',
    (done) => {
      app.post('/logout')
      .set({ 'x-access-token': 'invalidtoken' })
      .end((error, response) => {
        response.status.should.equal(401);
        response.body.status.should.equal('fail');
        done();
      });
    });

    it('should fail to logout a user without a token',
    (done) => {
      app.post('/logout')
      .end((error, response) => {
        response.status.should.equal(403);
        response.body.status.should.equal('fail');
        response.body.message.should.equal('No token provided.');
        done();
      });
    });

    it('should deny access to a user with a logged out token',
    (done) => {
      app.get(`/api/v1/users/${regularUser.id}`)
      .set({ 'x-access-token': adminToken })
      .end((error, response) => {
        response.status.should.equal(401);
        response.body.status.should.equal('fail');
        response.body.message.should.equal('you need to login.');
        done();
      });
    });
  });
});
