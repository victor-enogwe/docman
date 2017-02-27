import helper    from './helpers/index.helpers';

const app = helper.app;

describe('Home:', () => {
  it('Should return http code 200 and a welcome message', (done) => {
    app.get('/')
    .end((error, response) => {
      response.status.should.equal(200);
      response.body.message.should
      .equal('Welcome to the document management api.');
      done();
    });
  });
});

