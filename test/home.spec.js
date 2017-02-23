import helper    from './helpers/index.helpers';

const supertest = helper.supertest;
const should = helper.should;
const app = supertest(helper.app);

describe('Home:', () => {
  it('Should return http code 201 if a Regular User is created', (done) => {
    app.get('/')
    .end((error, response) => {
      response.status.should.equal(200);
      done();
    });
  });
});

