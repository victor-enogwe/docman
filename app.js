import dotenv                from 'dotenv';
// import chokidar              from 'chokidar';
import path                  from 'path';
import express               from 'express';
// import webpack               from 'webpack';
// import webpackDevMiddleware  from 'webpack-dev-middleware';
// import webpackHotMiddleware  from 'webpack-hot-middleware';
// import DashboardPlugin       from 'webpack-dashboard/plugin';
// import config                from './config/webpack.config.development';
import favicon               from 'serve-favicon';
import logger                from 'morgan';
//import cookieParser          from 'cookie-parser';
import bodyParser            from 'body-parser';
import debug                 from 'debug';
import http                  from 'http';
//import cssModulesRequireHook from 'css-modules-require-hook';
import routes                from './server/routes/index';
import users                 from './server/routes/users';

dotenv.config();
debug('docman:server');
//cssModulesRequireHook({generateScopedName: '[path][name]-[local]'});

const app = express();
//const compiler = webpack(config);

//compiler.apply(new DashboardPlugin());

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
app.use('/', routes);
app.use('/users', users);
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

// app.use(webpackDevMiddleware(compiler, {
//   noInfo: true,
//   publicPath: config.output.publicPath,
//   stats: {
//     colors: true
//   },
//   historyApiFallback: true
// }));

// app.use(webpackHotMiddleware(compiler));

// Do "hot-reloading" of express stuff on the server
// Throw away cached modules and re-require next time
// Ensure there's no important state in there!
// const watcher = chokidar.watch('./server');

// watcher.on('ready', () => {
//   watcher.on('all', () => {
//     console.log("Clearing /server/ module cache from server");
//     Object.keys(require.cache).forEach((id) => {
//       if (/[\/\\]server[\/\\]/.test(id)) delete require.cache[id];
//     });
//   });
// });

// Do "hot-reloading" of react stuff on the server
// Throw away the cached client modules and let them be re-required next time
// compiler.plugin('done', () => {
//   console.log("Clearing /client/ module cache from server");
//   Object.keys(require.cache).forEach((id) => {
//     if (/[\/\\]client[\/\\]/.test(id)) delete require.cache[id];
//   });
// });

const server = http.createServer(app);

server.listen(port);
server.on('error', onError);
server.on('listening', onListening);

module.exports = app;
