import should    from 'should';
import supertest from 'supertest';
import app       from '../../app';
import testData  from './spec.helpers';

process.NODE_ENV = 'test';

export default {
  app,
  should,
  supertest,
  testData
};
