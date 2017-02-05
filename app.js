import dotenv                from 'dotenv';
import path                  from 'path';
import express               from 'express';
import session               from 'express-session';
import favicon               from 'serve-favicon';
import logger                from 'morgan';
import Logger                from 'js-logger';
import bodyParser            from 'body-parser';
import cookieParser          from 'cookie-parser';
import debug                 from 'debug';
import http                  from 'http';
import passport              from 'passport';
import webpack               from 'webpack';
import webpackDevMiddleware  from 'webpack-dev-middleware';
import webpackHotMiddleware  from 'webpack-hot-middleware';
import DashboardPlugin       from 'webpack-dashboard/plugin';
import db                    from './server/models/';
import config                from './config/webpack.config';
import Routes                from './server/controllers/routes/Routes';

dotenv.config();
debug('docman:server');
Logger.useDefaults();

const compiler = webpack(config);
// Apply CLI dashboard for your webpack dev server
compiler.apply(new DashboardPlugin());

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

app.set('views', path.join(__dirname, 'server/views'));
app.set('view engine', 'pug');
app.set('port', port);

app.use(webpackDevMiddleware(compiler, {
  noInfo: true,
  publicPath: config.output.publicPath,
  stats: {
    colors: true
  },
  historyApiFallback: true
}));
app.use(webpackHotMiddleware(compiler));
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(favicon(path.join(__dirname, 'client/assetsimages/favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'client/assets')));
app.use('/install', Routes.database);
app.use('/api/v1/users/', Routes.users);
app.use('/api/v1/documents', Routes.documents);
// send everthing else to react
app.use('*', Routes.home);

server.on('error', onError);
server.on('listening', onListening);

db.sequelize
  .authenticate()
  .then(() => server.listen(port))
  .catch(err => err);

module.exports = app;
