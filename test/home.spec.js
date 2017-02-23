import helper    from './helpers/index.helpers';

const supertest = helper.supertest;
const app = supertest(helper.app);

describe('Home:', () => {
  it('Should return http code 200 and a welcome message', (done) => {
    app.get('/')
    .end((error, response) => {
      response.status.should.equal(200);
      response.body.message.should.equal('Welcome to the document manage api.');
      done();
    });
  });
});

