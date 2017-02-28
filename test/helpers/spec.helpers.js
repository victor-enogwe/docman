import faker  from 'faker';

const testData = {
  validUser1: {
    username: 'ahmed',
    firstname: faker.name.firstName(),
    lastname: faker.name.lastName(),
    email: faker.internet.email(),
    password: 'fakeuserpass',
    password_confirmation: 'fakeuserpass'
  },
  validUser1Update: {
    lastname: faker.name.lastName(),
    email: faker.internet.email()
  },
  inValidUser1Update: {
    lastname: faker.name.lastName(),
    email: faker.internet.email(),
    menu: 'hey'
  },
  validUser2: {
    username: 'audu',
    firstname: faker.name.firstName(),
    lastname: faker.name.lastName(),
    email: faker.internet.email(),
    password: 'fakeuserpass',
    password_confirmation: 'fakeuserpass'
  },
  validUser3: {
    username: 'edena',
    firstname: faker.name.firstName(),
    lastname: faker.name.lastName(),
    email: faker.internet.email(),
    password: 'fakeuserpass',
    password_confirmation: 'fakeuserpass'
  },
  validUser4: {
    username: 'Bison',
    firstname: faker.name.firstName(),
    lastname: faker.name.lastName(),
    email: faker.internet.email(),
    password: 'fakeuserpass',
    password_confirmation: 'fakeuserpass'
  },
  validUser5: {
    username: 'Major',
    firstname: faker.name.firstName(),
    lastname: faker.name.lastName(),
    email: faker.internet.email(),
    password: 'fakeuserpass',
    password_confirmation: 'fakeuserpass'
  },
  validUser6: {
    username: 'aurora',
    firstname: faker.name.firstName(),
    lastname: faker.name.lastName(),
    email: faker.internet.email(),
    password: 'fakeuserpass',
    password_confirmation: 'fakeuserpass'
  },
  validUser7: {
    username: 'lekan',
    firstname: faker.name.firstName(),
    lastname: faker.name.lastName(),
    email: faker.internet.email(),
    password: 'fakeuserpass',
    password_confirmation: 'fakeuserpass'
  },
  invalidUser1: {
    username: 'dorothy',
    firstname: faker.name.firstName(),
    lastname: faker.name.lastName(),
    email: faker.internet.email(),
    password: 'fakeuserpass',
    password_confirmation: 'fakeuser'
  },
  invalidUser2: {
    usernam: 'emilia',
    hacked: faker.internet.userName(),
    firstnam: faker.name.firstName(),
    lastname: faker.name.lastName(),
    email: faker.internet.email(),
    passw: 'fakeuserpass',
    password_confirmation: 'fakeuser'
  },
  invalidUser3: {
    username: 'solomon',
    firstname: faker.name.firstName(),
    lastname: faker.name.lastName(),
    email: faker.internet.email(),
    password: 'fakeuse',
    password_confirmation: 'fakeuse'
  },
  invalidUser4: {
    username: 'neddin',
    firstname: faker.name.firstName(),
    lastname: faker.name.lastName(),
    email: faker.internet.email(),
    roleId: 0,
    password: 'fakeuser',
    password_confirmation: 'fakeuser'
  },
  invalidUser5: {
    username: 'i',
    firstname: faker.name.firstName(),
    lastname: faker.name.lastName(),
    email: faker.internet.email(),
    password: 'fakeuser',
    password_confirmation: 'fakeuser'
  },
  invalidUser6: {
    username: 'iammorethan20charactersofcoursedothidagainandagainandIthinkthi\
iammorethan20charactersofcoursedothidagainandagainandIthinkthi',
    firstname: faker.name.firstName(),
    lastname: faker.name.lastName(),
    email: faker.internet.email(),
    password: 'fakeuser',
    password_confirmation: 'fakeuser'
  },
  invalidUser7: {
    username: 'deloite',
    firstname: 'e',
    lastname: faker.name.lastName(),
    email: faker.internet.email(),
    password: 'fakeuser',
    password_confirmation: 'fakeuser'
  },
  invalidUser8: {
    username: 'demiGod',
    firstname: 'ihavetoputin50charactersheresupercalifragilisticexpialidociou\
iammorethan20charactersofcoursedothidagainandagainandIthinkthi',
    lastname: faker.name.lastName(),
    email: faker.internet.email(),
    password: 'fakeuser',
    password_confirmation: 'fakeuser'
  },
  invalidUser9: {
    username: 'zipporah',
    firstname: faker.name.firstName(),
    lastname: 'r',
    email: faker.internet.email(),
    password: 'fakeuser',
    password_confirmation: 'fakeuser'
  },
  invalidUser10: {
    username: 'riley',
    firstname: faker.name.firstName(),
    lastname: 'ihavetoputin50charactersheresupercalifragilisticexpialidociou',
    email: faker.internet.email(),
    password: 'fakeuser',
    password_confirmation: 'fakeuser'
  },
  invalidUser11: {
    username: 'kareen',
    firstname: faker.name.firstName(),
    lastname: faker.name.lastName(),
    email: 'a@yahhoooooo',
    password: 'fakeuser',
    password_confirmation: 'fakeuser'
  },
  invalidUser12: {
    username: 'kareen',
    firstname: faker.name.firstName(),
    lastname: faker.name.lastName(),
    email: `rNwj0DTYKDtgutzStfGsBpBiQK3ZZoM1eNlMBamT36Ee6wPrt6vZPgPMjrCurSpoFk\
FCIqQQBoyrOh9D4zSzcKFAYoVY3LG9h8hTWuJo5nz6huPibG1pZJTgfzjNpWiAgO1GQZL94s8pwWkP\
URfmReJYbjM5tV4wbJgg1XpCqJs5BYHR8xxceyErcbzrvyAngOyBsSKaIESk29cuhEQTHhMy0FuZ1l\
SiUrUTXIrpEHVG9isLTNSNjLl14iFjaefKGlIEK7AHp3PK1J5GWlP6C6ORw725yayXevXWLbAMp
@yahoo.com`,
    password: 'fakeuser',
    password_confirmation: 'fakeuser'
  },
  invalidUser13: {
    username: 'kareen',
    firstname: faker.name.firstName(),
    lastname: faker.name.lastName(),
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
  validUser6Document: {
    title: faker.company.catchPhrase(),
    excerpt: faker.lorem.sentence(),
    access: 'private',
    content: faker.lorem.paragraph()
  },
  invalidUser6Document: {
    title: faker.company.catchPhrase(),
    excerpt: faker.lorem.sentence(),
    access: 'private',
    content: faker.lorem.paragraph()
  }
};

export default testData;
