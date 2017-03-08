import dotenv    from 'dotenv';

dotenv.config();

const database = process.env.DB_NAME;
const user = process.env.DB_USER;
const password = process.env.DB_PASS;
const host = process.env.DB_HOST;
const dialect = process.env.DB_TYPE;
const port = process.env.DB_PORT;

export default {
  database,
  user,
  password,
  host,
  dialect,
  port
};
