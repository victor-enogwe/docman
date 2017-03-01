export default (sequelize, DataTypes) => {
  const Document = sequelize.define('Document', {
    creatorId: {
      allowNull: false,
      type: DataTypes.INTEGER,
      validate: {
        is: {
          args: /\d+/i,
          msg: 'creatorId must be a number'
        }
      }
    },
    title: {
      allowNull: false,
      type: DataTypes.STRING,
      validate: {
        is: {
          args: /^[A-Za-z](\w|\s|-){2,254}$/i,
          msg: 'The document title must start with a letter and be \
3 - 255 characters long can also contain spaces or hyphens.'
        }
      },
      set(value) {
        this.setDataValue('title', value.trim());
      }
    },
    excerpt: {
      defaultValue: 'add short description',
      type: DataTypes.STRING,
      validate: {
        is: {
          args: /^\w+/i,
          msg: 'The excerpt should only contain alpha-numeric characters.'
        }
      },
      set(value) {
        this.setDataValue('excerpt', value.trim());
      }
    },
    content: {
      type: DataTypes.TEXT,
      validate: {
        is: {
          args: /^\w+/i,
          msg: 'The content should only contain alpha-numeric characters.'
        },
        isEmpty(value) {
          if (!value) {
            throw new Error('Content  cannot be empty');
          }
        }
      },
      set(value) {
        this.setDataValue('content', value.trim());
      }
    },
    access: {
      defaultValue: 'private',
      type: DataTypes.STRING,
      validate: {
        isIn: {
          args: [['private', 'public', 'users']],
          msg: 'access can only be public, private or users'
        }
      },
      allowNull: false,
    },
    authorized: {
      type: DataTypes.STRING
    },
  }, {
    // indexes: [
    //   // add a FULLTEXT index
    //   {
    //     type: 'FULLTEXT',
    //     name: 'Documents_Index',
    //     fields: ['title', 'excerpt']
    //   }
    // ],
    classMethods: {
      validateContent(document) {
        const regexContent = new RegExp(
          /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/,
          'gi'
        );
        const regexHtml = new RegExp(
          /<("[^"]*"|'[^']*'|[^'">])*>/,
          'gi'
        );

        if (regexHtml.test(document.excerpt)) {
          throw new Error('Document excerpt contains dissallowed markup');
        } else if (regexContent.test(document.content)) {
          throw new Error('Document content contains dissallowed markup');
        }
      }
    },
    hooks: {
      beforeCreate(document) {
        this.validateContent(document);
      },
      beforeUpdate(document) {
        this.validateContent(document);
      }
    },
    freezeTableName: true
  });

  return Document;
};
