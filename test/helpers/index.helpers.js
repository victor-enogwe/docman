import should    from 'should';
import supertest from 'supertest';
import server       from '../../app';
import testData  from './spec.helpers';

const app = supertest(server);

export default {
  app,
  should,
  testData
};
