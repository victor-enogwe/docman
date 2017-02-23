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
  invalidUser1: {
    username: faker.internet.userName(),
    firstname: faker.name.firstName(),
    lastname: faker.name.lastName(),
    email: faker.internet.email(),
    password: 'fakeuserpass',
    password_confirmation: 'fakeuser'
  },
  invalidUser2: {
    usernam: faker.internet.userName(),
    hacked: faker.internet.userName(),
    firstnam: faker.name.firstName(),
    lastname: faker.name.lastName(),
    email: faker.internet.email(),
    passw: 'fakeuserpass',
    password_confirmation: 'fakeuser'
  },
  invalidUser3: {
    username: faker.internet.userName(),
    firstname: faker.name.firstName(),
    lastname: faker.name.lastName(),
    email: faker.internet.email(),
    password: 'fakeuse',
    password_confirmation: 'fakeuse'
  },
  invalidUser4: {
    username: faker.internet.userName(),
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
    username: faker.internet.userName(),
    firstname: faker.name.firstName(),
    lastname: 'r',
    email: faker.internet.email(),
    password: 'fakeuser',
    password_confirmation: 'fakeuser'
  },
  invalidUser10: {
    username: faker.internet.userName(),
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
  // adminUser1: {
  //   username: faker.internet.userName(),
  //   firstName: faker.name.firstName(),
  //   lastName: faker.name.lastName(),
  //   email: faker.internet.email(),
  //   password: faker.internet.password(),
  //   roleId: 1
  // },
  // adminUser2: {
  //   username: faker.internet.userName(),
  //   firstName: faker.name.firstName(),
  //   lastName: faker.name.lastName(),
  //   email: faker.internet.email(),
  //   password: faker.internet.password(),
  //   roleId: 1
  // },
  // adminUser3: {
  //   username: faker.internet.userName(),
  //   firstName: faker.name.firstName(),
  //   lastName: faker.name.lastName(),
  //   email: faker.internet.email(),
  //   password: faker.internet.password(),
  //   roleId: 1
  // },
  // adminUser4: {
  //   username: faker.internet.userName(),
  //   firstName: faker.name.firstName(),
  //   lastName: faker.name.lastName(),
  //   email: faker.internet.email(),
  //   password: faker.internet.password(),
  //   roleId: 1
  // },
  // adminUser5: {
  //   username: faker.internet.userName(),
  //   firstName: faker.name.firstName(),
  //   lastName: faker.name.lastName(),
  //   email: faker.internet.email(),
  //   password: faker.internet.password(),
  //   roleId: 1
  // },
  // adminUserRole: {
  //   username: faker.internet.userName(),
  //   firstName: faker.name.firstName(),
  //   lastName: faker.name.lastName(),
  //   email: faker.internet.email(),
  //   password: faker.internet.password(),
  //   roleId: 1
  // },
  // adminUserSearch: {
  //   username: faker.internet.userName(),
  //   firstName: faker.name.firstName(),
  //   lastName: faker.name.lastName(),
  //   email: faker.internet.email(),
  //   password: faker.internet.password(),
  //   roleId: 1
  // },
  // adminUserForDocumentTest: {
  //   username: faker.internet.userName(),
  //   firstName: faker.name.firstName(),
  //   lastName: faker.name.lastName(),
  //   email: faker.internet.email(),
  //   password: faker.internet.password(),
  //   roleId: 1
  // },
  // testUser: {
  //   username: faker.internet.userName(),
  //   firstName: faker.name.firstName(),
  //   lastName: faker.name.lastName(),
  //   email: faker.internet.email(),
  //   password: faker.internet.password()
  // },
  // regularUserForDocumentTest: {
  //   username: faker.internet.userName(),
  //   firstName: faker.name.firstName(),
  //   lastName: faker.name.lastName(),
  //   email: faker.internet.email(),
  //   password: faker.internet.password(),
  //   roleId: 2
  // },
  // regularUserForDocumentTest2: {
  //   username: faker.internet.userName(),
  //   firstName: faker.name.firstName(),
  //   lastName: faker.name.lastName(),
  //   email: faker.internet.email(),
  //   password: faker.internet.password(),
  //   roleId: 2
  // },
  // regularUser1: {
  //   username: faker.internet.userName(),
  //   firstName: faker.name.firstName(),
  //   lastName: faker.name.lastName(),
  //   email: faker.internet.email(),
  //   password: faker.internet.password(),
  //   roleId: 2
  // },
  // regularUserRole: {
  //   username: faker.internet.userName(),
  //   firstName: faker.name.firstName(),
  //   lastName: faker.name.lastName(),
  //   email: faker.internet.email(),
  //   password: faker.internet.password(),
  //   roleId: 2
  // },
  // regularUser2: {
  //   username: faker.internet.userName(),
  //   firstName: faker.name.firstName(),
  //   lastName: faker.name.lastName(),
  //   email: faker.internet.email(),
  //   password: faker.internet.password(),
  //   roleId: 2
  // },
  // regularUser3: {
  //   username: faker.internet.userName(),
  //   firstName: faker.name.firstName(),
  //   lastName: faker.name.lastName(),
  //   email: faker.internet.email(),
  //   password: faker.internet.password(),
  //   roleId: 2
  // },
  // regularUser4: {
  //   username: faker.internet.userName(),
  //   firstName: faker.name.firstName(),
  //   lastName: faker.name.lastName(),
  //   email: faker.internet.email(),
  //   password: faker.internet.password(),
  //   roleId: 2
  // },
  // regularUser5: {
  //   username: faker.internet.userName(),
  //   firstName: faker.name.firstName(),
  //   lastName: faker.name.lastName(),
  //   email: faker.internet.email(),
  //   password: faker.internet.password(),
  //   roleId: 2
  // },
  // // Note before using thise documents, a ownerId property should be added
  // documentRole1: {
  //   title: faker.company.catchPhrase(),
  //   access: 'role',
  //   content: faker.lorem.paragraph()
  // },
  // documentPrivate1: {
  //   title: faker.company.catchPhrase(),
  //   access: 'private',
  //   content: faker.lorem.paragraph()
  // },
  // documentPublic1: {
  //   title: faker.company.catchPhrase(),
  //   access: 'public',
  //   content: faker.lorem.paragraph()
  // },
  // documentRole2: {
  //   title: faker.company.catchPhrase(),
  //   access: 'role',
  //   content: faker.lorem.paragraph()
  // },
  // documentPrivate2: {
  //   title: faker.company.catchPhrase(),
  //   access: 'private',
  //   content: faker.lorem.paragraph()
  // },
  // documentPublic2: {
  //   title: faker.company.catchPhrase(),
  //   access: 'public',
  //   content: faker.lorem.paragraph()
  // },
  // documentRole3: {
  //   title: faker.company.catchPhrase(),
  //   access: 'role',
  //   content: faker.lorem.paragraph()
  // },
  // documentPrivate3: {
  //   title: faker.company.catchPhrase(),
  //   access: 'private',
  //   content: faker.lorem.paragraph()
  // },
  // documentPublic3: {
  //   title: faker.company.catchPhrase(),
  //   access: 'public',
  //   content: faker.lorem.paragraph()
  // },
  // documentRole4: {
  //   title: faker.company.catchPhrase(),
  //   access: 'role',
  //   content: faker.lorem.paragraph()
  // },
  // documentPrivate4: {
  //   title: faker.company.catchPhrase(),
  //   access: 'private',
  //   content: faker.lorem.paragraph()
  // },
  // documentInvalid: {
  // },
  // documentNoAccess: {
  //   title: faker.company.catchPhrase(),
  //   content: faker.lorem.paragraph()
  // },
  // documentPublic4: {
  //   title: faker.company.catchPhrase(),
  //   access: 'public',
  //   content: faker.lorem.paragraph()
  // },
  // newRole1: {
  //   title: 'rookie'
  // },
  // updateRole1: {
  //   title: 'rookie update'
  // },
  // duplicateRole1: {
  //   title: 'rookie'
  // },
  // newRole2: {
  //   title: 'amateur'
  // },
  // newRole3: {
  //   title: 'professional'
  // }
};

export default testData;
