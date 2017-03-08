import faker  from 'Faker';
import dotenv from 'dotenv';

dotenv.config();

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
    password: process.env.ADMIN_PASSWORD,
    password_confirmation: process.env.ADMIN_PASSWORD,
  },
  userDocument: {
    title: faker.Lorem.sentence(),
    excerpt: faker.Lorem.sentences(),
    access: 'private',
    content: faker.Lorem.paragraph()
  },
  longTitle: 'rNwj0DTYKDtgutzStfGsBpBiQK3ZZoM1eNlMB\
6wPrt6vZPgPMjrCurSpoFkFCIqQQBoyrOh9D4zSzcKFAYoVY3LG9h8hTWuJo5nz6huPibG1pZJTgfz\
jNpWiAgO1GQZL94s8pwWkPURfmReJYbjM5tV4wbJgg1XpCqJs5BYHR8xxceyErcbzrvyAngOyBsSKa\
IESk29cuhEQTHhMy0FuZ1lSiUrUTXIrpEHVG9isLTNSNjLl14iFjaefKGlIEK7AHp3PK1J5GWlP6C6\
ORw725yayXevXWLbAMpgghghghghghghghghhghhghghhghgghghghghghghghghhghghghghghgh',
  longEmail: 'rNwj0DTYKDtgutzStfGsBpBiQK3ZZoM1eNlMBamT36\
6wPrt6vZPgPMjrCurSpoFkFCIqQQBoyrOh9D4zSzcKFAYoVY3LG9h8hTWuJo5nz6huPibG1pZJTgfz\
jNpWiAgO1GQZL94s8pwWkPURfmReJYbjM5tV4wbJgg1XpCqJs5BYHR8xxceyErcbzrvyAngOyBsSKa\
IESk29cuhEQTHhMy0FuZ1lSiUrUTXIrpEHVG9isLTNSNjLl14iFjaefKGlIEK7AHp3PK1J5GWlP6C6\
ORw725yayXevXWLbAMp@yahoo.com'
};

export default testData;
