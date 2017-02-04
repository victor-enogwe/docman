import React   from 'react';
import {IndexRoute, Route} from 'react-router';
import Form    from './components/Form';
import Nav   from './components/Nav';
import About   from './components/About';
import NotFound from './components/NotFound'

export default (
  <Route path='/' component={Nav} >
    <IndexRoute component={Form} />
    <Route path='about' component={About} />
    <Route path='*' component={NotFound}/>
  </Route>
)
