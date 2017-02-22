import dotenv                from 'dotenv';
import path                  from 'path';
import express               from 'express';
import logger                from 'morgan';
import Logger                from 'js-logger';
import bodyParser            from 'body-parser';
import debug                 from 'debug';
import http                  from 'http';;
import db                    from './server/models/';
import Routes                from './server/controllers/routes/Routes';

dotenv.config();
debug('docman:server');
Logger.useDefaults();

const app = express();

/**
 * Normalize a port into a number, string, or false.
 * @param {Number} val
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
 * @param {any} error
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

app.set('port', port);

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use('/api/v1/users/', Routes.users);
app.use('/api/v1/documents', Routes.documents);
app.use('*', Routes.home);

server.on('error', onError);
server.on('listening', onListening);

db.sequelize
  .authenticate()
  .then(() => server.listen(port))
  .catch(err => err);

module.exports = app;
