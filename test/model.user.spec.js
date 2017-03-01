import db     from '../server/models';
import helper from './helpers/index.helpers';

const testData = helper.testData;
const userModel = db.User;

before((done) => {
  db.sequelize.authenticate().then(() => done());
});

describe('User Model: ', () => {
  describe('Username: ', () => {
    it('should not allow duplicate usernames', (done) => {
      userModel.create(testData.adminUserCreate).catch((error) => {
        error.errors[0].message.should
        .equal('Oops. There is an existing account with this username.');
        done();
      });
    });

    it('should not allow usernames that starts without a letter', (done) => {
      userModel.create(testData.badUsername).catch((error) => {
        error.errors[0].message.should
        .equal('Username must start with a letter, have no spaces, and be 3 - \
40 characters long.');
        done();
      });
    });

    it('should not allow usernames with spaces', (done) => {
      userModel.create(testData.spaceUsername).catch((error) => {
        error.errors[0].message.should
        .equal('Username must start with a letter, have no spaces, and be 3 - \
40 characters long.');
        done();
      });
    });

    it('should not allow usernames longer than 40 characters', (done) => {
      userModel.create(testData.longUsername).catch((error) => {
        error.errors[0].message.should
        .equal('Username must start with a letter, have no spaces, and be 3 - \
40 characters long.');
        done();
      });
    });

    it('should not allow usernames less than 3 characters', (done) => {
      userModel.create(testData.shortUsername).catch((error) => {
        error.errors[0].message.should
        .equal('Username must start with a letter, have no spaces, and be 3 - \
40 characters long.');
        done();
      });
    });
  });

  describe('Firstname: ', () => {
    it('should not allow firstnames that starts without a letter', (done) => {
      userModel.create(testData.badFirstname).catch((error) => {
        error.errors[0].message.should
        .equal('Firstname must start with a letter, have no spaces, and be 3 - \
40 characters long.');
        done();
      });
    });

    it('should not allow firstnames with spaces', (done) => {
      userModel.create(testData.spaceFirstname).catch((error) => {
        error.errors[0].message.should
        .equal('Firstname must start with a letter, have no spaces, and be 3 - \
40 characters long.');
        done();
      });
    });

    it('should not allow firstnames longer than 40 characters', (done) => {
      userModel.create(testData.longFirstname).catch((error) => {
        error.errors[0].message.should
        .equal('Firstname must start with a letter, have no spaces, and be 3 - \
40 characters long.');
        done();
      });
    });

    it('should not allow firstnames less than 3 characters', (done) => {
      userModel.create(testData.shortFirstname).catch((error) => {
        error.errors[0].message.should
        .equal('Firstname must start with a letter, have no spaces, and be 3 - \
40 characters long.');
        done();
      });
    });

    it('should not allow firstnames that starts without a letter', (done) => {
      userModel.create(testData.badFirstname).catch((error) => {
        error.errors[0].message.should
        .equal('Firstname must start with a letter, have no spaces, and be 3 - \
40 characters long.');
        done();
      });
    });
  });

  describe('Lastname: ', () => {
    it('should not allow lastnames with spaces', (done) => {
      userModel.create(testData.spaceLastname).catch((error) => {
        error.errors[0].message.should
        .equal('Lastname must start with a letter, have no spaces, and be 3 - \
40 characters long.');
        done();
      });
    });

    it('should not allow lastnames longer than 40 characters', (done) => {
      userModel.create(testData.longLastname).catch((error) => {
        error.errors[0].message.should
        .equal('Lastname must start with a letter, have no spaces, and be 3 - \
40 characters long.');
        done();
      });
    });

    it('should not allow lastnames less than 3 characters', (done) => {
      userModel.create(testData.shortLastname).catch((error) => {
        error.errors[0].message.should
        .equal('Lastname must start with a letter, have no spaces, and be 3 - \
40 characters long.');
        done();
      });
    });
  });

  describe('Email: ', () => {
    it('should not allow duplicate emails', (done) => {
      userModel.create(testData.adminDuplicateEmail).catch((error) => {
        error.errors[0].message.should
        .equal('Oops. There is an existing account with this email address.');
        done();
      });
    });

    it('should not allow invalid emails', (done) => {
      userModel.create(testData.invalidUser11).catch((error) => {
        error.errors[0].message.should
        .equal('The email you entered is invalid.');
        done();
      });
    });

    it('should not allow emails longer than 254 characters', (done) => {
      userModel.create(testData.invalidUser12).catch((error) => {
        error.errors[0].message.should
        .equal('The email you entered is invalid  and longer \
than 254 characters.');
        done();
      });
    });
  });

  describe('RoleId: ', () => {
    it('should only allow roleIds of 1 or 0', (done) => {
      userModel.create(testData.badRoleUser).catch((error) => {
        error.errors[0].message.should
        .equal('roleId can only be 0 or 1');
        done();
      });
    });
  });

  describe('Password: ', () => {
    it('should only allow passwords longer than seven characters', (done) => {
      userModel.create(testData.badPasswordUser).catch((error) => {
        error.errors[0].message.should
        .equal('Please choose a longer password');
        done();
      });
    });

    it('should require password confirmation', (done) => {
      userModel.create(testData.noPasswordConfirmUser).catch((error) => {
        error.errors[0].message.should
        .equal('Please confirm password');
        done();
      });
    });

    it('should require password confirmation to match password', (done) => {
      userModel.create(testData.invalidUser1).catch((error) => {
        error.errors[0].message.should
        .equal('Password confirmation does not match password');
        done();
      });
    });
  });
});
