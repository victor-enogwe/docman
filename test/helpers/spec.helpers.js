import faker  from 'Faker';

const testData = {
  validUser: {
    username: 'amelia',
    firstname: 'lisby',
    lastname: 'saitama',
    email: 'saitamalisby@gmail.com',
    password: 'fakeuserpass',
    password_confirmation: 'fakeuserpass'
  },
  adminUser: {
    username: process.env.ADMIN_USERNAME,
    firstname: process.env.ADMIN_FIRSTNAME,
    lastname: process.env.ADMIN_LASTNAME,
    email: process.env.ADMIN_EMAIL,
    password: process.env.ADMIN_PASSWORD
  },
  userDocument: {
    title: faker.Lorem.sentence(),
    excerpt: faker.Lorem.sentences(),
    access: 'private',
    content: faker.Lorem.paragraph()
  }
};

export default testData;
