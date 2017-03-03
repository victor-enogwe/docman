import dotenv                from 'dotenv';
import debug                 from 'debug';
import path                  from 'path';
import express               from 'express';
import logger                from 'morgan';
import Logger                from 'js-logger';
import bodyParser            from 'body-parser';
import http                  from 'http';
import mysql                 from 'promise-mysql';
import bcrypt                from 'bcrypt-nodejs';
import dbConfig              from './config/db.env.config';
import db                    from './server/models/';
import Routes                from './server/controllers/routes/Routes';
import query                 from './config/query';

dotenv.config();
debug('docman:app');
Logger.useDefaults();

const app = express();
const dbHost = dbConfig.host;
const dbUser = dbConfig.user;
const dbPassword = dbConfig.password;
const database = dbConfig.database;
const dbConnection = mysql.createConnection({
  host: dbHost,
  user: dbUser,
  password: dbPassword
});

/**
 * Normalize a port into a number, string, or false.
 * @param {Number} val a string or number port
 * @returns {Number} a number representing the port
 */
const normalizePort = (val) => {
  const portNumber = parseInt(val, 10);
  if (isNaN(portNumber)) {
    return val;
  }

  if (portNumber >= 0) {
    return portNumber;
  }
  return false;
};

const port = normalizePort(process.env.PORT || '3000');
const server = http.createServer(app);

/**
 * Event listener for HTTP server "error" event.
 * @param {any} error an error message
 * @returns {null} error already thrown
 */
const onError = (error) => {
  if (error.syscall !== 'listen') {
    throw error;
  }
  const bind = typeof port === 'string'
    ? `Pipe ${port}`
    : `Port ${port}`;
  switch (error.code) {
    case 'EACCES':
      Logger.error(`${bind} requires elevated privileges`);
      process.exit(1);
      break;
    case 'EADDRINUSE':
      Logger.error(`${bind} is already in use`);
      process.exit(1);
      break;
    default:
      throw error;
  }
};

/**
 * Event listener for HTTP server "listening" event.
 * @returns {null} server process is continous here, so no returns
 */
const onListening = () => {
  const addr = server.address();
  const bind = typeof addr === 'string'
    ? `pipe ${addr}`
    : `port ${addr.port}`;
  debug(`🚧 App is Listening on ${bind}`);
};
const headers1 = 'Origin, X-Requested-With, Content-Type, Accept';
const headers2 = ',Authorization, Access-Control-Allow-Credentials';

app.set('views', path.join(__dirname, 'server/views'));
app.set('view engine', 'pug');
app.set('port', port);

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, DELETE, PATCH');
  res.header('Access-Control-Allow-Headers', `${headers1} ${headers2}`);
  res.header('Access-Control-Allow-Credentials', 'true');
  next();
});
app.use(logger('dev'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use('/', Routes.home);
app.use('/api/v1/users/', Routes.users);
app.use('/api/v1/documents', Routes.documents);
app.use('/api/v1/search', Routes.search);

server.on('listening', onListening);
server.on('error', onError);

dbConnection.then(connection => connection
.query(`CREATE DATABASE IF NOT EXISTS ${database}`))
.then(() => Logger
.warn('🚧 Initial Database Connection Successful. App Booting Up ...'))
.then(() => db.sequelize.sync())
.then(() => db.User.findOne({ where: {
  $or: [{
    username: process.env.ADMIN_USERNAME
  }, { email: process.env.ADMIN_EMAIL }]
} }))
.then((userExists) => {
  if (!userExists) {
    return db.User.create({
      roleId: 0,
      username: process.env.ADMIN_USERNAME,
      firstname: process.env.ADMIN_FIRSTNAME,
      lastname: process.env.ADMIN_LASTNAME,
      email: process.env.ADMIN_EMAIL,
      password: process.env.ADMIN_PASSWORD,
      password_confirmation: process.env.ADMIN_PASSWORD,
      password_digest: bcrypt.hashSync(process.env.ADMIN_PASSWORD,
      bcrypt.genSaltSync(10)),
      createdAt: Date.now(),
      updatedAt: Date.now()
    }).then(() => db.sequelize.query(query.query, { raw: true }));
  }
  return 'Admin User Already Created... All Set...';
})
.then(() => server.listen(port, () => Logger
.warn(`🚧 Admin User Already Created... All Set...
🚧 App is Listening on ${port}`)))
.catch(err => Logger.error(err));

export default app;

