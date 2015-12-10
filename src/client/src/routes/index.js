import React from 'react';
import { Router, Route, IndexRoute } from 'react-router';
import CoreLayout from 'layouts/core-layout';
import IndexView from 'views/index-view';
import UserView from 'views/user-view';
import TileView from 'views/tile-view';

/**
 * Routes supported
 * @type {XML}
 */
const routes = (
  <Router>
    <Route path='/' component={CoreLayout}>
      <IndexRoute component={IndexView}/>
    </Route>
    <Route path='/user' component={CoreLayout}>
      <IndexRoute component={UserView}/>
    </Route>
    <Route path='/tile'>
      <IndexRoute component={TileView}/>
    </Route>
  </Router>
);

export default routes;
