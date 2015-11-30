import React from 'react';
import { Router, Route, IndexRoute } from 'react-router';
import CoreLayout from 'layouts/core-layout';
import IndexView from 'views/index-view';

export default (
  <Router>
    <Route path='/' component={CoreLayout}>
      <IndexRoute component={IndexView}/>
    </Route>
    <Route path='/user' component={CoreLayout}>
      <IndexRoute component={IndexView}/>
    </Route>
    <Route path='/admin' component={CoreLayout}>
      <IndexRoute component={IndexView}/>
    </Route>
  </Router>
);
