import faker  from 'Faker';

const testData = {
  validUser1: {
    username: 'amelia',
    firstname: faker.Name.firstName(),
    lastname: faker.Name.lastName(),
    email: faker.Internet.email(),
    password: 'fakeuserpass',
    password_confirmation: 'fakeuserpass'
  },
  validUser1Update: {
    lastname: faker.Name.lastName(),
    email: faker.Internet.email()
  },
  inValidUser1Update: {
    lastname: faker.Name.lastName(),
    email: faker.Internet.email(),
    menu: 'hey'
  },
  validUser2: {
    username: 'beethoven',
    firstname: faker.Name.firstName(),
    lastname: faker.Name.lastName(),
    email: faker.Internet.email(),
    password: 'fakeuserpass',
    password_confirmation: 'fakeuserpass'
  },
  validUser3: {
    username: 'Katherine',
    firstname: faker.Name.firstName(),
    lastname: faker.Name.lastName(),
    email: faker.Internet.email(),
    password: 'fakeuserpass',
    password_confirmation: 'fakeuserpass'
  },
  validUser4: {
    username: 'Mozart',
    firstname: faker.Name.firstName(),
    lastname: faker.Name.lastName(),
    email: faker.Internet.email(),
    password: 'fakeuserpass',
    password_confirmation: 'fakeuserpass'
  },
  validUser5: {
    username: 'bethany',
    firstname: faker.Name.firstName(),
    lastname: faker.Name.lastName(),
    email: faker.Internet.email(),
    password: 'fakeuserpass',
    password_confirmation: 'fakeuserpass'
  },
  validUser6: {
    username: 'sagat',
    firstname: faker.Name.firstName(),
    lastname: faker.Name.lastName(),
    email: faker.Internet.email(),
    password: 'fakeuserpass',
    password_confirmation: 'fakeuserpass'
  },
  validUser7: {
    username: 'subzero',
    firstname: faker.Name.firstName(),
    lastname: faker.Name.lastName(),
    email: faker.Internet.email(),
    password: 'fakeuserpass',
    password_confirmation: 'fakeuserpass'
  },
  invalidUser1: {
    username: 'simbi',
    firstname: faker.Name.firstName(),
    lastname: faker.Name.lastName(),
    email: faker.Internet.email(),
    password: 'fakeuserpass',
    password_confirmation: 'fakeuser'
  },
  invalidUser2: {
    usernam: 'melanie',
    hacked: faker.Internet.userName(),
    firstnam: faker.Name.firstName(),
    lastname: faker.Name.lastName(),
    email: faker.Internet.email(),
    passw: 'fakeuserpass',
    password_confirmation: 'fakeuser'
  },
  invalidUser3: {
    username: 'karlried',
    firstname: faker.Name.firstName(),
    lastname: faker.Name.lastName(),
    email: faker.Internet.email(),
    password: 'fakeuse',
    password_confirmation: 'fakeuse'
  },
  invalidUser4: {
    username: 'depay',
    firstname: faker.Name.firstName(),
    lastname: faker.Name.lastName(),
    email: faker.Internet.email(),
    roleId: 0,
    password: 'fakeuser',
    password_confirmation: 'fakeuser'
  },
  invalidUser5: {
    username: 'i',
    firstname: 'clothilde',
    lastname: faker.Name.lastName(),
    email: faker.Internet.email(),
    password: 'fakeuser',
    password_confirmation: 'fakeuser'
  },
  invalidUser6: {
    username: 'iammorethan20charactersofcoursedothidagainandagainandIthinkthi\
iammorethan20charactersofcoursedothidagainandagainandIthinkthi',
    firstname: faker.Name.firstName(),
    lastname: faker.Name.lastName(),
    email: faker.Internet.email(),
    password: 'fakeuser',
    password_confirmation: 'fakeuser'
  },
  invalidUser7: {
    username: 'sassenach',
    firstname: 'e',
    lastname: faker.Name.lastName(),
    email: faker.Internet.email(),
    password: 'fakeuser',
    password_confirmation: 'fakeuser'
  },
  invalidUser8: {
    username: 'moore',
    firstname: 'ihavetoputin50charactersheresupercalifragilisticexpialidociou\
iammorethan20charactersofcoursedothidagainandagainandIthinkthi',
    lastname: faker.Name.lastName(),
    email: faker.Internet.email(),
    password: 'fakeuser',
    password_confirmation: 'fakeuser'
  },
  invalidUser9: {
    username: 'abraham',
    firstname: faker.Name.firstName(),
    lastname: 'r',
    email: faker.Internet.email(),
    password: 'fakeuser',
    password_confirmation: 'fakeuser'
  },
  invalidUser10: {
    username: 'darlingthon',
    firstname: 'darling',
    lastname: 'ihavetoputin50charactersheresupercalifragilisticexpialidociou',
    email: faker.Internet.email(),
    password: 'fakeuser',
    password_confirmation: 'fakeuser'
  },
  invalidUser11: {
    username: 'ceceliamay',
    firstname: 'baker',
    lastname: 'ramsey',
    email: 'a@yahhoooooo',
    password: 'fakeuser',
    password_confirmation: 'fakeuser'
  },
  invalidUser12: {
    username: 'deriderson',
    firstname: faker.Name.firstName(),
    lastname: faker.Name.lastName(),
    email: `rNwj0DTYKDtgutzStfGsBpBiQK3ZZoM1eNlMBamT36Ee6wPrt6vZPgPMjrCurSpoFk\
FCIqQQBoyrOh9D4zSzcKFAYoVY3LG9h8hTWuJo5nz6huPibG1pZJTgfzjNpWiAgO1GQZL94s8pwWkP\
URfmReJYbjM5tV4wbJgg1XpCqJs5BYHR8xxceyErcbzrvyAngOyBsSKaIESk29cuhEQTHhMy0FuZ1l\
SiUrUTXIrpEHVG9isLTNSNjLl14iFjaefKGlIEK7AHp3PK1J5GWlP6C6ORw725yayXevXWLbAMp
@yahoo.com`,
    password: 'fakeuser',
    password_confirmation: 'fakeuser'
  },
  invalidUser13: {
    username: 'jongzhou',
    firstname: faker.Name.firstName(),
    lastname: faker.Name.lastName(),
    email: 'a@yahhoooooo',
    password: 'fakeuser',
    password_confirmation: ''
  },
  adminUser: {
    username: process.env.ADMIN_USERNAME,
    firstname: process.env.ADMIN_FIRSTNAME,
    lastname: process.env.ADMIN_LASTNAME,
    email: process.env.ADMIN_EMAIL,
    password: process.env.ADMIN_PASSWORD
  },
  adminUserCreate: {
    username: process.env.ADMIN_USERNAME,
    firstname: process.env.ADMIN_FIRSTNAME,
    lastname: process.env.ADMIN_LASTNAME,
    email: process.env.ADMIN_EMAIL,
    password: process.env.ADMIN_PASSWORD,
    password_confirmation: process.env.ADMIN_PASSWORD
  },
  adminDuplicateEmail: {
    username: 'cristus',
    firstname: process.env.ADMIN_FIRSTNAME,
    lastname: process.env.ADMIN_LASTNAME,
    email: process.env.ADMIN_EMAIL,
    password: process.env.ADMIN_PASSWORD,
    password_confirmation: process.env.ADMIN_PASSWORD
  },
  badUsername: {
    username: '2cecelia',
    firstname: faker.Name.firstName(),
    lastname: faker.Name.lastName(),
    email: 'a@yahoo.com',
    password: 'fakeuser',
    password_confirmation: 'fakeuser'
  },
  spaceUsername: {
    username: '2cecelia hey',
    firstname: faker.Name.firstName(),
    lastname: faker.Name.lastName(),
    email: 'a@yahoo.com',
    password: 'fakeuser',
    password_confirmation: 'fakeuser'
  },
  longUsername: {
    username: '2ceceliaheyfffffffffffffffffffffffffffffffffffffffffffffffffff',
    firstname: faker.Name.firstName(),
    lastname: faker.Name.lastName(),
    email: 'a@yahoo.com',
    password: 'fakeuser',
    password_confirmation: 'fakeuser'
  },
  shortUsername: {
    username: '2c',
    firstname: faker.Name.firstName(),
    lastname: faker.Name.lastName(),
    email: 'a@yahoo.com',
    password: 'fakeuser',
    password_confirmation: 'fakeuser'
  },
  badFirstname: {
    username: 'cecelia',
    firstname: '2cecelia',
    lastname: faker.Name.lastName(),
    email: 'a@yahoo.com',
    password: 'fakeuser',
    password_confirmation: 'fakeuser'
  },
  spaceFirstname: {
    username: 'cecelia',
    firstname: '2cecelia hey',
    lastname: faker.Name.lastName(),
    email: 'a@yahoo.com',
    password: 'fakeuser',
    password_confirmation: 'fakeuser'
  },
  longFirstname: {
    username: 'cecelia',
    firstname: '2ceceliaheyffffffffffffffffffffffffffffffffffffffffffffffffff',
    lastname: faker.Name.lastName(),
    email: 'a@yahoo.com',
    password: 'fakeuser',
    password_confirmation: 'fakeuser'
  },
  shortFirstname: {
    username: 'cecelia',
    firstname: 'ce',
    lastname: faker.Name.lastName(),
    email: 'a@yahoo.com',
    password: 'fakeuser',
    password_confirmation: 'fakeuser'
  },
  badLastname: {
    username: 'cecelia',
    firstname: 'cecelia',
    lastname: '2cecelia',
    email: 'a@yahoo.com',
    password: 'fakeuser',
    password_confirmation: 'fakeuser'
  },
  spaceLastname: {
    username: 'cecelia',
    firstname: 'cecilia',
    lastname: '2cecelia hey',
    email: 'a@yahoo.com',
    password: 'fakeuser',
    password_confirmation: 'fakeuser'
  },
  longLastname: {
    username: 'cecelia',
    firstname: 'cecelia',
    lastname: '2ceceliaheyfffffffffffffffffffffffffffffffffffffffffffffffffff',
    email: 'a@yahoo.com',
    password: 'fakeuser',
    password_confirmation: 'fakeuser'
  },
  shortLastname: {
    username: 'cecelia',
    firstname: 'cecelia',
    lastname: 'ce',
    email: 'a@yahoo.com',
    password: 'fakeuser',
    password_confirmation: 'fakeuser'
  },
  badRoleUser: {
    roleId: 'false',
    username: 'simonellasss',
    firstname: 'cecelia',
    lastname: 'cecelia',
    email: 'ajax@yahoo.com',
    password: 'fakeuser',
    password_confirmation: 'fakeuser'
  },
  badPasswordUser: {
    username: 'cecelia',
    firstname: 'cecelia',
    lastname: 'cecelia',
    email: 'a@yahoo.com',
    roleId: 1,
    password: 'fakeu',
    password_confirmation: 'fakeu'
  },
  noPasswordConfirmUser: {
    username: 'simonellasss',
    firstname: 'cecelia',
    lastname: 'cecelia',
    email: 'ajax@yahoo.com',
    password: 'fakeuser',
    roleId: 1,
    password_confirmation: ''
  },
  validUser6Document: {
    title: faker.Lorem.sentence(),
    excerpt: faker.Lorem.sentences(),
    access: 'private',
    content: faker.Lorem.paragraph()
  },
  invalidUser6Document: {
    title: faker.Lorem.sentence(),
    excerpt: faker.Lorem.sentences(),
    access: 'private',
    content: faker.Lorem.paragraph()
  }
};

export default testData;
