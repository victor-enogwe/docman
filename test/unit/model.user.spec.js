import helper from '../helpers/index.helpers';
import db     from '../../server/models/index';

const app = helper.app;
const testData = helper.testData;

const userModel = db.User;

describe('User Model: ', () => {
  before((done) => {
    app.get('/').then(() => done());
  });

  describe('Validations: ', () => {
    describe('Username: ', () => {
      it('should not allow duplicate usernames', (done) => {
        userModel.create(testData.adminUser).catch((error) => {
          error.errors[0].message.should
          .equal('Oops. There is an existing account with this username.');
          done();
        });
      });

      it('should not allow usernames that starts without a letter', (done) => {
        testData.adminUser.username = '2center';
        userModel.create(testData.adminUser).catch((error) => {
          error.errors[0].message.should
          .equal('Username must start with a letter, have no spaces, and be \
3 - 40 characters long.');
          done();
        });
      });

      it('should not allow usernames with spaces', (done) => {
        testData.adminUser.username = 'center now';
        userModel.create(testData.adminUser).catch((error) => {
          error.errors[0].message.should
          .equal('Username must start with a letter, have no spaces, and be \
3 - 40 characters long.');
          done();
        });
      });

      it('should not allow usernames longer than 40 characters', (done) => {
        testData.adminUser.username = 'iammorethan20charactersofcoursedothidag\
nandagainandIthinkthiiammorethan20charactersofcoursedothidagainandagainandIthi\
nkthi';
        userModel.create(testData.adminUser).catch((error) => {
          error.errors[0].message.should
          .equal('Username must start with a letter, have no spaces, and be \
3 - 40 characters long.');
          done();
        });
      });

      it('should not allow usernames less than 3 characters', (done) => {
        testData.adminUser.username = 'de';
        userModel.create(testData.adminUser).catch((error) => {
          error.errors[0].message.should
          .equal('Username must start with a letter, have no spaces, and be \
3 - 40 characters long.');
          testData.adminUser.username = 'adminuser';
          done();
        });
      });
    });

    describe('Firstname: ', () => {
      it('should not allow firstnames with spaces', (done) => {
        testData.adminUser.firstname = 'cent is';
        userModel.create(testData.adminUser).catch((error) => {
          error.errors[0].message.should
          .equal('Firstname must start with a letter, have no spaces, and be \
3 - 40 characters long.');
          done();
        });
      });

      it('should not allow firstnames longer than 40 characters', (done) => {
        userModel.create(testData.adminUser).catch((error) => {
          testData.adminUser.firstname = 'iammorethan20charactersofcoursedothd\
nandagainandIthinkthiiammorethan20charactersofcoursedothidagainandagaissnandIi\
nkthi';
          error.errors[0].message.should
          .equal('Firstname must start with a letter, have no spaces, and be \
3 - 40 characters long.');
          done();
        });
      });

      it('should not allow firstnames less than 3 characters', (done) => {
        userModel.create(testData.adminUser).catch((error) => {
          testData.adminUser.firstname = 'ce';
          error.errors[0].message.should
          .equal('Firstname must start with a letter, have no spaces, and be \
3 - 40 characters long.');
          done();
        });
      });

      it('should not allow firstnames that starts without a letter', (done) => {
        testData.adminUser.firstname = '2cent';
        userModel.create(testData.adminUser).catch((error) => {
          error.errors[0].message.should
          .equal('Firstname must start with a letter, have no spaces, and be \
3 - 40 characters long.');
          testData.adminUser.firstname = 'victor';
          done();
        });
      });
    });

    describe('Lastname: ', () => {
      it('should not allow lastnames with spaces', (done) => {
        testData.adminUser.firstname = 'victor';
        testData.adminUser.lastname = 'cent is';
        userModel.create(testData.adminUser).catch((error) => {
          error.errors[0].message.should
          .equal('Lastname must start with a letter, have no spaces, and be \
3 - 40 characters long.');
          done();
        });
      });

      it('should not allow lastnames longer than 40 characters', (done) => {
        testData.adminUser.lastname = 'iammorethan20charactersofcoursedothidag\
nandagainandIthinkthiiammorethan20charactersofcoursedothidagainandagainandIthi\
nkthiddd';
        userModel.create(testData.adminUser).catch((error) => {
          error.errors[0].message.should
          .equal('Lastname must start with a letter, have no spaces, and be \
3 - 40 characters long.');
          done();
        });
      });

      it('should not allow lastnames less than 3 characters', (done) => {
        testData.adminUser.lastname = 'ce';
        userModel.create(testData.adminUser).catch((error) => {
          error.errors[0].message.should
          .equal('Lastname must start with a letter, have no spaces, and be \
3 - 40 characters long.');
          testData.adminUser.lastname = 'enogwe';
          done();
        });
      });
    });

    describe('Email: ', () => {
      it('should not allow duplicate emails', (done) => {
        userModel.create(testData.adminUser).catch((error) => {
          error.errors[0].message.should
          .equal('Oops. There is an existing account with this email address.');
          testData.adminUser.email = 'ce';
          done();
        });
      });

      it('should not allow invalid emails', (done) => {
        userModel.create(testData.adminUser).catch((error) => {
          error.errors[0].message.should
          .equal('The email you entered is invalid.');
          done();
        });
      });

      it('should not allow emails longer than 254 characters', (done) => {
        testData.adminUser.email = 'rNwj0DTYKDtgutzStfGsBpBiQK3ZZoM1eNlMBamT36\
6wPrt6vZPgPMjrCurSpoFkFCIqQQBoyrOh9D4zSzcKFAYoVY3LG9h8hTWuJo5nz6huPibG1pZJTgfz\
jNpWiAgO1GQZL94s8pwWkPURfmReJYbjM5tV4wbJgg1XpCqJs5BYHR8xxceyErcbzrvyAngOyBsSKa\
IESk29cuhEQTHhMy0FuZ1lSiUrUTXIrpEHVG9isLTNSNjLl14iFjaefKGlIEK7AHp3PK1J5GWlP6C6\
ORw725yayXevXWLbAMp@yahoo.com';
        userModel.create(testData.adminUser).catch((error) => {
          error.errors[0].message.should
          .equal('The email you entered is invalid  and longer \
than 254 characters.');
          done();
        });
      });
    });

    describe('RoleId: ', () => {
      it('should only allow roleIds of 1 or 0', (done) => {
        testData.adminUser.email = 'victor.enogwe@andela.com';
        testData.adminUser.roleId = 3;
        userModel.create(testData.adminUser).catch((error) => {
          error.errors[0].message.should
          .equal('roleId can only be 0 or 1');
          done();
        });
      });
    });

    describe('Password: ', () => {
      it('should only allow passwords longer than seven characters', (done) => {
        testData.adminUser.roleId = 0;
        testData.adminUser.password = 'pass';
        userModel.create(testData.adminUser).catch((error) => {
          error.errors[0].message.should
          .equal('Please choose a longer password');
          testData.adminUser.password = 'password2';
          testData.adminUser.password_confirmation = '';
          done();
        });
      });

      it('should require password confirmation', (done) => {
        userModel.create(testData.adminUser).catch((error) => {
          error.errors[0].message.should
          .equal('Please confirm password');
          testData.adminUser.password_confirmation = 'password';
          done();
        });
      });

      it('should require password confirmation to match password', (done) => {
        userModel.create(testData.adminUser).catch((error) => {
          error.errors[0].message.should
          .equal('Password confirmation does not match password');
          done();
        });
      });
    });
  });

  describe('CRUD: ', () => {
    let newUser;
    describe('Create', () => {
      it('should create a user account', (done) => {
        testData.validUser.password = 'password';
        testData.validUser.password_confirmation = 'password';
        delete testData.validUser.invalidField;
        userModel.create(testData.validUser)
        .then((user) => {
          newUser = user.dataValues;
          user.dataValues.should.have.property('id').which.is.a.Number();
          done();
        });
      });
    });

    describe('Read: ', () => {
      it('should get user details', (done) => {
        userModel.findById(newUser.id)
        .then((user) => {
          user.should.have.property('id').which.is.equal(newUser.id);
          done();
        });
      });
    });

    describe('Update: ', () => {
      it('should update a user account', (done) => {
        userModel.findById(newUser.id)
        .then((user) => {
          user.update({ firstname: 'updatedfirstname' })
          .then((updatedUser) => {
            updatedUser.should.have.property('firstname')
            .which.is.equal('updatedfirstname');
            done();
          });
        });
      });
    });

    describe('Delete: ', () => {
      it('should delete a user account', (done) => {
        userModel.destroy({ where: { id: newUser.id } })
        .then((deleted) => {
          deleted.should.equal(1);
          done();
        });
      });
    });
  });
});
