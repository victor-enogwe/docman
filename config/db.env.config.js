import dotenv    from 'dotenv';

dotenv.config();

let database, user, password, host, dialect, port;

switch (process.env.NODE_ENV) {
  case 'development':
    database = process.env.DEV_DB_NAME;
    user = process.env.DEV_DB_USER;
    password = process.env.DEV_DB_PASS;
    host = process.env.DEV_DB_HOST;
    dialect = process.env.DEV_DB_TYPE;
    port = process.env.DEV_DB_PORT;
    break;
  case 'test':
    database = process.env.TEST_DB_NAME;
    user = process.env.TEST_DB_USER;
    password = process.env.TEST_DB_PASS;
    host = process.env.TEST_DB_HOST;
    dialect = process.env.TEST_DB_TYPE;
    port = process.env.TEST_DB_PORT;
    break;
  default:
    database = process.env.DB_NAME;
    user = process.env.DB_USER;
    password = process.env.DB_PASS;
    host = process.env.DB_HOST;
    dialect = process.env.DB_TYPE;
    port = process.env.DB_PORT;
}

export default {
  database,
  user,
  password,
  host,
  dialect,
  port
};
