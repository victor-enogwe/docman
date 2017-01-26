import dotenv                from 'dotenv';
import path                  from 'path';
import express               from 'express';
import favicon               from 'serve-favicon';
import logger                from 'morgan';
import bodyParser            from 'body-parser';
import debug                 from 'debug';
import http                  from 'http';
import Sequelize             from 'sequelize';

import Routes                from './server/routes/Routes';

dotenv.config();
debug('docman:server');

const database = new Sequelize(process.env.DB, process.env.DB_USER, process.env.DB_PASS, {
  host: 'localhost',
  port: process.env.DB_PORT,
  dialect: 'mysql'
});

const app = express();

/**
 * Normalize a port into a number, string, or false.
 */
const normalizePort = (val) => {
  const port = parseInt(val, 10);
  if (isNaN(port)) {
    return val;
  }

  if (port >= 0) {
    return port;
  }
  return false;
}

/**
 * Event listener for HTTP server "error" event.
 */
const onError = (error) => {
  if (error.syscall !== 'listen') {
    throw error;
  }
  const bind = typeof port === 'string'
    ? 'Pipe ' + port
    : 'Port ' + port;
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use');
      process.exit(1);
      break;
    default:
      throw error;
  }
}

/**
 * Event listener for HTTP server "listening" event.
 */
const onListening = () => {
  const addr = server.address();
  const bind = typeof addr === 'string'
    ? 'pipe ' + addr
    : 'port ' + addr.port;
  debug('🚧 App is Listening on ' + bind);
}

const port = normalizePort(process.env.PORT || '3000');

app.set('views', path.join(__dirname, 'client/views'));
app.set('view engine', 'pug');
app.set('port', port);

app.use(favicon(__dirname + '/client/assets/images/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
// app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'client/assets')));
app.use('/', Routes.home);
app.use('/users', Routes.users);
// app.use('/documents', Routes.documents);
app.use((req, res, next) => {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

if (app.get('env') === 'development') {
  app.use((err, req, res, next) => {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

app.use((err, req, res, next) => {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

const server = http.createServer(app);

server.on('error', onError);
server.on('listening', onListening);

database.authenticate()
  .then(err => server.listen(port))
  .catch(err => err);

module.exports = app;
