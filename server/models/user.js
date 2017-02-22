import bcrypt from 'bcrypt-nodejs';
import jwt    from 'jsonwebtoken';

export default (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: {
        args: true,
        msg: 'Oops. There is an existing account with this username.'
      },
      validate: {
        is: {
          args: /^[A-Za-z][A-Za-z]{2,39}$/i,
          msg: 'Username must start with a letter, have no spaces, and be 3 - \
40 characters long.'
        }
      },
      set(value) {
        this.setDataValue('username', value.trim().toLowerCase());
      }
    },
    firstname: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        is: {
          args: /^[A-Za-z][A-Za-z]{2,39}$/i,
          msg: 'Firstname must start with a letter, have no spaces, and be 3 - \
40 characters long.'
        }
      },
      set(value) {
        this.setDataValue('firstname', value.trim().toLowerCase());
      }
    },
    lastname: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        is: {
          args: /^[A-Za-z][A-Za-z]{2,39}$/i,
          msg: 'Lastname must start with a letter, have no spaces, and be 3 - \
40 characters long.'
        }
      },
      set(value) {
        this.setDataValue('lastname', value.trim().toLowerCase());
      }
    },
    email: {
      allowNull: false,
      type: DataTypes.STRING,
      unique: {
        args: true,
        msg: 'Oops. There is an existing account with this email address.',
      },
      validate: {
        isEmail: {
          args: true,
          msg: 'The email you entered is invalid.'
        },
        isTooLong(value) {
          if (value.length > 254) {
            throw new Error('The email you entered is invalid  and longer \
than 254 characters.');
          }
        }
      },
      set(value) {
        this.setDataValue('email', value.trim().toLowerCase());
      }
    },
    auth_token: {
      type: DataTypes.TEXT,
      defaultValue: null,
    },
    roleId: {
      allowNull: false,
      type: DataTypes.INTEGER,
      validate: {
        isZeroOrOne(value) {
          value = parseInt(value, 10);
          if (value < 0 || value > 1) {
            throw new Error('roleId can only be 0 or 1');
          }
        }
      },
      defaultValue: 1,
    },
    password: {
      type: DataTypes.VIRTUAL,
      allowNull: false,
      validate: {
        isLongEnough(val) {
          if (val.length < 8) {
            throw new Error('Please choose a longer password');
          }
        },
        hasConfirmation() {
          const confirmation = this.getDataValue('password_confirmation');
          if (!confirmation) {
            throw new Error('Please confirm password');
          }
        }
      }
    },
    password_confirmation: {
      type: DataTypes.VIRTUAL,
      allowNull: false,
      validate: {
        isPassword(value) {
          if (value !== this.getDataValue('password')) {
            throw new Error('Password confirmation does not match password');
          }
          const salt = bcrypt.genSaltSync(10);
          const hash = bcrypt.hashSync(value, salt);
          this.setDataValue('password_digest', hash);
        }
      }
    },
    password_digest: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: true
      }
    }
  }, {
    classMethods: {
      associate(models) {
        User.hasMany(models.Document, {
          foreignKey: 'creatorId',
          onDelete: 'CASCADE'
        });
      }
    },

    instanceMethods: {
      /**
       * generate a jwt token
       * @method
       * @returns {String} jwt token
       */
      generateToken() {
        const user = this.dataValues;
        delete user.auth_token;
        return jwt.sign(user, process.env.JWT_SECRET, {
          expiresIn: 86400
        });
      },
      /**
       * Compare plain password to user's hashed password
       * @method
       * @param {String} password takes a password string
       * @returns {Array} array containing validation and token
       */
      authenticate(password) {
        const auth = bcrypt.compareSync(password, this.password_digest);
        if (auth) {
          return [true, this.generateToken()];
        }
        return [false, null];
      }
    },

    freezeTableName: true,
    // paranoid: true
  });
  return User;
};
