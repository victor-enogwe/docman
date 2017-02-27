import helper    from './helpers/index.helpers';
import db        from '../server/models/index';

const app = helper.app;
const testData = helper.testData;

// before((done) => {
//   db.sequelize.sync()
//   // .then(() => {
//   //   db.User.destroy({
//   //     where: {
//   //       roleId: 1
//   //     }
//   //   }).then(() => done());
//   // });
// });

describe('Users:', () => {
  const regularUser = testData.validUser1;
  const adminUser = testData.adminUser;
  let regularUserId, adminUserToken, regularUserToken;
  describe('Create Regular User', () => {
    it('Should return http code 201 if a Regular User is created', (done) => {
      app.post('/api/v1/users')
      .send(regularUser)
      .end((error, response) => {
        regularUserId = response.body.message.id;
        response.status.should.equal(201);
        done();
      });
    });

    it('Should be be successful and ensure that new user has a roleId',
    (done) => {
      app.post('/api/v1/users')
      .send(testData.validUser2)
      .end((error, response) => {
        response.body.success.should.equal(true);
        response.body.message.should.have.property('roleId').equal(1);
        done();
      });
    });

    it('Should ensure that new user has a username, firstname and lastname',
    (done) => {
      app.post('/api/v1/users')
      .send(testData.validUser5)
      .end((error, response) => {
        response.body.success.should.equal(true);
        response.body.message.should.have.property('username');
        response.body.message.should.have.property('firstname');
        response.body.message.should.have.property('lastname');
        done();
      });
    });

    it('Should not allow duplicate username in the database', (done) => {
      app.post('/api/v1/users')
      .send(testData.validUser1)
      .end((error, response) => {
        response.status.should.equal(400);
        response.body.success.should.equal(false);
        response.body.message.should
        .equal('Oops. There is an existing account with this username.');
        done();
      });
    });

    it('Should not allow duplicate email in the database', (done) => {
      testData.validUser2.username = 'folashade';
      app.post('/api/v1/users')
      .send(testData.validUser2)
      .end((error, response) => {
        response.status.should.equal(400);
        response.body.success.should.equal(false);
        response.body.message.should
        .equal('Oops. There is an existing account with this email address.');
        done();
      });
    });

    it(`Should disallow user creation if the password does not match
password confirmation`,
    (done) => {
      app.post('/api/v1/users')
      .send(testData.invalidUser1)
      .end((error, response) => {
        response.status.should.equal(400);
        response.body.success.should.equal(false);
        response.body.message.should
        .equal('Password confirmation does not match password');
        done();
      });
    });

    it('Should disallow user creation if request body contains invalid keys',
    (done) => {
      app.post('/api/v1/users')
      .send(testData.invalidUser2)
      .end((error, response) => {
        const badKeys = '( usernam,hacked,firstnam,passw )';
        response.status.should.equal(400);
        response.body.success.should.equal(false);
        response.body.message.should
        .equal(`badly formatted request body including ${badKeys}`);
        done();
      });
    });

    it('Should require a password of atleast eight characters', (done) => {
      app.post('/api/v1/users')
      .send(testData.invalidUser3)
      .end((error, response) => {
        response.status.should.equal(400);
        response.body.message.should
        .equal('Please choose a longer password');
        done();
      });
    });

    it('Should not allow roleId in request body during creation', (done) => {
      app.post('/api/v1/users')
      .send(testData.invalidUser4)
      .end((error, response) => {
        response.status.should.equal(400);
        response.body.success.should.equal(false);
        response.body.message.should
        .equal('badly formatted request body including ( roleId )');
        done();
      });
    });

    it('Should only allow usernames having more than 2 characters', (done) => {
      app.post('/api/v1/users')
      .send(testData.invalidUser5)
      .end((error, response) => {
        response.status.should.equal(400);
        response.body.message.should
        .equal('Username must start with a letter, have no spaces, and \
be 3 - 40 characters long.');
        done();
      });
    });

    it('Should only allow usernames having less than 40 characters', (done) => {
      app.post('/api/v1/users')
      .send(testData.invalidUser6)
      .end((error, response) => {
        response.status.should.equal(400);
        response.body.message.should
        .equal('Username must start with a letter, have no spaces, and be \
3 - 40 characters long.');
        done();
      });
    });

    it('Should only allow firstnames having more than 2 characters', (done) => {
      app.post('/api/v1/users')
      .send(testData.invalidUser7)
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
      app.post('/api/v1/users')
      .send(testData.invalidUser8)
      .end((error, response) => {
        response.status.should.equal(400);
        response.body.message.should
        .equal('Firstname must start with a letter, have no spaces, and be \
3 - 40 characters long.');
        done();
      });
    });

    it('Should only allow lastnames having more than 2 characters', (done) => {
      app.post('/api/v1/users')
      .send(testData.invalidUser9)
      .end((error, response) => {
        response.status.should.equal(400);
        response.body.message.should
        .equal('Username must start with a letter, have no spaces, and be \
3 - 40 characters long.');
        done();
      });
    });

    it('Should only allow lastnames having less than 50 characters',
    (done) => {
      app.post('/api/v1/users')
      .send(testData.invalidUser10)
      .end((error, response) => {
        response.status.should.equal(400);
        response.body.message.should
        .equal('Username must start with a letter, have no spaces, and be \
3 - 40 characters long.');
        done();
      });
    });

    it('Should only allow valid emails',
    (done) => {
      app.post('/api/v1/users')
      .send(testData.invalidUser11)
      .end((error, response) => {
        response.status.should.equal(400);
        response.body.message.should
        .equal('The email you entered is invalid.');
        done();
      });
    });

    it('Should only allow emails less than 254 characters',
    (done) => {
      app.post('/api/v1/users')
      .send(testData.invalidUser12)
      .end((error, response) => {
        response.status.should.equal(400);
        response.body.message.should
        .equal('The email you entered is invalid  and longer \
than 254 characters.');
        done();
      });
    });

    it('Should disallow user creation if password \
confirmation is empty',
    (done) => {
      app.post('/api/v1/users')
      .send(testData.invalidUser13)
      .end((error, response) => {
        response.status.should.equal(400);
        response.body.message.should
        .equal('Please confirm password');
        done();
      });
    });

    it(`Should not return the security details of 
the created Regular User`, (done) => {
      app.post('/api/v1/users')
      .send(testData.validUser3)
      .end((error, response) => {
        response.status.should.equal(201);
        response.body.message.should.not.have.property('password');
        response.body.message.should.not.have.property('password_confirmation');
        response.body.message.should.not.have.property('password_digest');
        response.body.message.should.not.have.property('auth_token');
        done();
      });
    });

    it('Should create a user without admin privileges', (done) => {
      app.post('/api/v1/users')
      .send(testData.validUser4)
      .end((error, response) => {
        response.status.should.equal(201);
        response.body.message.roleId.should.not.equal(0);
        done();
      });
    });
  });

  describe('Login', () => {
    it('Should allow login for admin user with valid credentials', (done) => {
      app.post('/login')
      .send({
        email: adminUser.email,
        password: adminUser.password
      })
      .end((error, response) => {
        response.status.should.equal(200);
        response.body.success.should.equal(true);
        done();
      });
    });

    it('Should disallow login for invalid admin user password', (done) => {
      app.post('/login')
      .send({
        email: adminUser.email,
        password: 'invalidpassword'
      })
      .end((error, response) => {
        response.body.success.should.equal(false);
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
        response.body.success.should.equal(false);
        response.body.message.should
        .equal('Authentication failed! User not found.');
        done();
      });
    });

    it('Should allow either username or passowrd login, not both for admin',
    (done) => {
      app.post('/login')
      .send({
        username: adminUser.username,
        email: adminUser.email,
        password: adminUser.password
      })
      .end((error, response) => {
        response.body.success.should.equal(false);
        response.body.message.should
        .equal('Please supply either user name or email, plus your password');
        done();
      });
    });

    it('Should return a token if the admin user login is successful',
    (done) => {
      app.post('/login')
      .send({
        email: adminUser.email,
        password: adminUser.password
      })
      .end((error, response) => {
        adminUserToken = response.body.token;
        response.status.should.equal(200);
        response.body.message.should.equal('Enjoy your token!');
        response.body.should.have.property('token').which.is.a.String();
        response.body.token.length.should.be.above(1);
        done();
      });
    });

    it('Should allow admin login with username',
    (done) => {
      app.post('/login')
      .send({
        username: adminUser.username,
        password: adminUser.password
      })
      .end((error, response) => {
        adminUserToken = response.body.token;
        response.status.should.equal(200);
        response.body.message.should.equal('Enjoy your token!');
        response.body.should.have.property('token').which.is.a.String();
        response.body.token.length.should.be.above(1);
        done();
      });
    });

    it('Should allow admin login with email',
    (done) => {
      app.post('/login')
      .send({
        email: adminUser.email,
        password: adminUser.password
      })
      .end((error, response) => {
        adminUserToken = response.body.token;
        response.status.should.equal(200);
        response.body.message.should.equal('Enjoy your token!');
        response.body.should.have.property('token').which.is.a.String();
        response.body.token.length.should.be.above(1);
        done();
      });
    });

    it('Should not return a token if admin user login fails', (done) => {
      app.post('/login')
      .send({
        email: adminUser.email,
        password: 'invaidpassword'
      })
      .end((error, response) => {
        response.status.should.equal(401);
        response.body.success.should.equal(false);
        response.body.should.not.have.property('token');
        done();
      });
    });

    it('Should allow login for a regular user with email',
    (done) => {
      app.post('/login')
      .send({
        email: regularUser.email,
        password: regularUser.password
      })
      .end((error, response) => {
        response.status.should.equal(200);
        response.body.success.should.equal(true);
        done();
      });
    });

    it('Should allow login for a regular user with username',
    (done) => {
      app.post('/login')
      .send({
        username: regularUser.username,
        password: regularUser.password
      })
      .end((error, response) => {
        response.status.should.equal(200);
        response.body.success.should.equal(true);
        done();
      });
    });

    it('Should disallow login for invalid regular user password', (done) => {
      app.post('/login')
      .send({
        email: regularUser.email,
        password: 'invalidpassword'
      })
      .end((error, response) => {
        response.body.success.should.equal(false);
        response.body.message.should
        .equal('Authentication failed! Wrong password.');
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
        response.body.success.should.equal(false);
        response.body.message.should
        .equal('Authentication failed! User not found.');
        done();
      });
    });

    it('Should allow username or passowrd login, not both for regular users',
    (done) => {
      app.post('/login')
      .send({
        username: regularUser.username,
        email: regularUser.email,
        password: regularUser.password
      })
      .end((error, response) => {
        response.body.success.should.equal(false);
        response.body.message.should
        .equal('Please supply either user name or email, plus your password');
        done();
      });
    });

    it('Should return a token if the regular user login is successful',
    (done) => {
      app.post('/login')
      .send({
        email: regularUser.email,
        password: regularUser.password
      })
      .end((error, response) => {
        regularUserToken = response.body.token;
        response.status.should.equal(200);
        response.body.message.should.equal('Enjoy your token!');
        response.body.should.have.property('token').which.is.a.String();
        response.body.token.length.should.be.above(1);
        done();
      });
    });

    it('Should not return a token if regular user login fails', (done) => {
      app.post('/login')
      .send({
        email: regularUser.email,
        password: 'invaidpassword'
      })
      .end((error, response) => {
        response.status.should.equal(401);
        response.body.success.should.equal(false);
        response.body.should.not.have.property('token');
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
        response.body.success.should.equal(false);
        response.body.message.should
        .equal('No token provided.');
        done();
      });
    });

    it('Should not allow access to users data without a valid token',
    (done) => {
      app.get('/api/v1/users/1')
      .set({ 'x-access-token': 'regular.User.Token' })
      .end((error, response) => {
        response.status.should.equal(401);
        response.body.success.should.equal(false);
        response.body.message.should
        .equal('Failed to authenticate token.');
        done();
      });
    });

    it('Should not allow a non-admin access other users data', (done) => {
      app.get(`/api/v1/users/${+regularUserId + 1}`)
      .set({ 'x-access-token': regularUserToken })
      .end((error, response) => {
        response.status.should.equal(401);
        response.body.success.should.equal(false);
        response.body.message.should
        .equal('You don\'t have authorization for this action');
        done();
      });
    });

    it('Should allow an admin user access to fetch any user data', (done) => {
      app.get(`/api/v1/users/${regularUserId}`)
      .set({ 'x-access-token': adminUserToken })
      .end((error, response) => {
        response.status.should.equal(200);
        response.body.success.should.equal(true);
        response.body.user.should.have.property('id');
        response.body.user.should.have.property('username');
        response.body.user.should.have.property('roleId');
        response.body.user.should.have.property('firstname');
        response.body.user.should.have.property('lastname');
        response.body.user.should.have.property('email');
        done();
      });
    });

    it('Should allow a regular user access to fetch their user data',
    (done) => {
      app.get(`/api/v1/users/${regularUserId}`)
      .set({ 'x-access-token': regularUserToken })
      .end((error, response) => {
        response.status.should.equal(200);
        response.body.success.should.equal(true);
        response.body.user.should.have.property('id');
        response.body.user.should.have.property('username');
        response.body.user.should.have.property('roleId');
        response.body.user.should.have.property('firstname');
        response.body.user.should.have.property('lastname');
        response.body.user.should.have.property('email');
        done();
      });
    });

    it('Should not return a user if user with userId doesn\'t exist',
    (done) => {
      app.get('/api/v1/users/1000')
      .set({ 'x-access-token': adminUserToken })
      .end((error, response) => {
        response.status.should.equal(404);
        response.body.success.should.equal(false);
        response.body.message.should.equal('user not found');
        done();
      });
    });

    it('Should only allow valid numeric userid to be queried', (done) => {
      app.get('/api/v1/users/ab')
      .set({ 'x-access-token': adminUserToken })
      .end((error, response) => {
        response.status.should.equal(406);
        response.body.success.should.equal(false);
        response.body.message.should
        .equal('parameter supplied should be a number');
        done();
      });
    });
  });

  // get all users
  describe('Get All Users: ', () => {
    it('Should not allow a non-admin access all users data', (done) => {
      app.get('/api/v1/users/')
      .set({ 'x-access-token': regularUserToken })
      .end((error, response) => {
        response.status.should.equal(401);
        response.body.success.should.equal(false);
        response.body.message.should
        .equal('You don\'t have authorization to perform this action');
        done();
      });
    });

    it('Should allow an admin user access to fetch all users data', (done) => {
      app.get('/api/v1/users/')
      .set({ 'x-access-token': adminUserToken })
      .end((error, response) => {
        response.status.should.equal(200);
        response.body.success.should.equal(true);
        response.body.users.rows.should.be.an.instanceOf(Array);
        response.body.users.rows[0].should.have.property('id');
        response.body.users.rows[0].should.have.property('username');
        response.body.users.rows[0].should.have.property('roleId');
        response.body.users.rows[0].should.have.property('firstname');
        response.body.users.rows[0].should.have.property('lastname');
        response.body.users.rows[0].should.have.property('email');
        done();
      });
    });
  });

  describe('Update User: ', () => {
    it('Should not allow user update if an invalid id is supplied',
  (done) => {
    app.patch('/api/v1/users/fffa')
    .set({ 'x-access-token': adminUserToken })
    .send(testData.validUser1Update)
    .end((error, response) => {
      response.status.should.equal(406);
      response.body.success.should.equal(false);
      response.body.message.should
      .equal('parameter supplied should be a number');
      done();
    });
  });

    it('Should not allow user update if the user does not exist',
    (done) => {
      app.patch('/api/v1/users/10000000')
      .set({ 'x-access-token': adminUserToken })
      .send(testData.validUser1Update)
      .end((error, response) => {
        response.status.should.equal(404);
        response.body.success.should.equal(false);
        response.body.message.should
        .equal('User Not found');
        done();
      });
    });

    it('Should not allow user update if an invalid token is supplied',
  (done) => {
    app.patch(`/api/v1/users/${regularUserId}`)
    .set({ 'x-access-token': 'regularUserToken' })
    .send(testData.validUser1Update)
    .end((error, response) => {
      response.status.should.equal(401);
      response.body.success.should.equal(false);
      response.body.message.should
      .equal('Failed to authenticate token.');
      done();
    });
  });

    it('Should not allow user update if no token is supplied',
  (done) => {
    app.patch(`/api/v1/users/${regularUserId}`)
    .send(testData.validUser1Update)
    .end((error, response) => {
      response.status.should.equal(403);
      response.body.success.should.equal(false);
      response.body.message.should
      .equal('No token provided.');
      done();
    });
  });

    it('Should not allow regular users update another users profile',
    (done) => {
      app.patch(`/api/v1/users/${+regularUserId + 1}`)
      .set({ 'x-access-token': regularUserToken })
      .send(testData.validUser1Update)
      .end((error, response) => {
        response.status.should.equal(401);
        response.body.success.should.equal(false);
        response.body.message.should
        .equal('You don\'t have authorization for this action');
        done();
      });
    });

    it(`Should not allow user to update profile if invalid update 
fields are supplied`,
    (done) => {
      app.patch(`/api/v1/users/${regularUserId}`)
      .set({ 'x-access-token': regularUserToken })
      .send(testData.inValidUser1Update)
      .end((error, response) => {
        response.status.should.equal(409);
        response.body.success.should.equal(false);
        response.body.message.should
        .equal('badly formatted request body including ( menu )');
        done();
      });
    });

    it('Should Allow a User Update his profile if he has a valid Token',
    (done) => {
      const firstname = 'newName';
      app.patch(`/api/v1/users/${regularUserId}`)
      .set({ 'x-access-token': regularUserToken })
      .send({
        firstname
      })
      .end((error, response) => {
        response.status.should.equal(201);
        response.body.message.firstname.should.equal('newname');
        done();
      });
    });

    it('Should NOT allow a User update his profile without a Valid Token',
    (done) => {
      app.patch(`/api/v1/users/${regularUserId}`)
      .set({ 'x-access-token': 'invalidToken' })
      .end((error, response) => {
        response.status.should.equal(401);
        response.body.success.should.equal(false);
        done();
      });
    });


    it('Should only allow user roleId update of 0 or 1 by admin', (done) => {
      app.patch(`/api/v1/users/${regularUserId}`)
      .set({ 'x-access-token': adminUserToken })
      .send({ roleId: 3 })
      .end((error, response) => {
        response.status.should.equal(500);
        response.body.success.should.equal(false);
        response.body.message.should
        .equal('roleId can only be 0 or 1');
        done();
      });
    });
  });

  describe('Delete User: ', () => {
    it('Should not allow a non-admin user to delete a user',
    (done) => {
      app.delete(`/api/v1/users/${regularUserId}`)
      .set({ 'x-access-token': regularUserToken })
      .end((error, response) => {
        response.status.should.equal(401);
        response.body.success.should.equal(false);
        response.body.message.should
        .equal('You don\'t have authorization to perform this action');
        done();
      });
    });

    it('Should not allow a user with an in-Valid token delete another user',
    (done) => {
      app.delete(`/api/v1/users/${regularUserId}`)
      .set({ 'x-access-token': 'invalidToken' })
      .end((error, response) => {
        response.status.should.equal(401);
        response.body.success.should.equal(false);
        response.body.message.should.equal('Failed to authenticate token.');
        done();
      });
    });

    it('Should allow an admin user with a valid token to delete any user',
    (done) => {
      app.delete(`/api/v1/users/${regularUserId + 1}`)
      .set({ 'x-access-token': adminUserToken })
      .end((error, response) => {
        response.status.should.equal(200);
        response.body.success.should.equal(true);
        response.body.message.should
        .equal(`Delete Successful! User witn ìd:${regularUserId + 1} deleted`);
        done();
      });
    });

    it('Should allow the deletion of the default admin account',
    (done) => {
      app.delete('/api/v1/users/1')
      .set({ 'x-access-token': adminUserToken })
      .end((error, response) => {
        response.status.should.equal(403);
        response.body.success.should.equal(false);
        response.body.message.should
        .equal('You cannot delete the default admin account');
        done();
      });
    });

    it('Should return a user does not exist message if admin tries to \
delete a non existing user', (done) => {
      app.delete(`/api/v1/users/${regularUserId + 10000}`)
      .set({ 'x-access-token': adminUserToken })
      .end((error, response) => {
        response.status.should.equal(404);
        response.body.success.should.equal(false);
        response.body.message.should
        .equal(`Delete Failed! User witn ìd:${regularUserId + 10000} \
Not found`);
        done();
      });
    });
  });

  describe('Logout', () => {
    it('should successfully logout an admin User with a valid token',
    (done) => {
      app.post('/logout')
      .set({ 'x-access-token': adminUserToken })
      .end((error, response) => {
        response.status.should.equal(200);
        response.body.success.should.equal(true);
        response.body.message.should.equal('you are now logged out');
        done();
      });
    });

    it('should successfully logout a regular User with a valid token',
    (done) => {
      app.post('/logout')
      .set({ 'x-access-token': regularUserToken })
      .end((error, response) => {
        response.status.should.equal(200);
        response.body.success.should.equal(true);
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
        response.body.success.should.equal(false);
        done();
      });
    });

    it('should deny access to a user with a logged out token',
    (done) => {
      app.get(`/api/v1/users/${regularUserId}`)
      .set({ 'x-access-token': regularUserToken })
      .end((error, response) => {
        response.status.should.equal(401);
        response.body.success.should.equal(false);
        response.body.message.should.equal('you need to login.');
        done();
      });
    });
  });
});

