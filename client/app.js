import React                     from 'react';
import ReactDOM                  from 'react-dom';
import MuiThemeProvider          from 'material-ui/styles/MuiThemeProvider';
import injectTapEventPlugin      from 'react-tap-event-plugin';
import {Router, browserHistory } from 'react-router';
import Routes                    from './routes';
import './assets/stylesheets/style.scss'

if (module.hot) {
  module.hot.accept();
}
const App = () => (
  <MuiThemeProvider>
    <Router history={browserHistory} routes={Routes}/>
  </MuiThemeProvider>
);

// Needed for onTouchTap
// http://stackoverflow.com/a/34015469/988941
injectTapEventPlugin();

ReactDOM.render(<App />, document.getElementById('docman')); 