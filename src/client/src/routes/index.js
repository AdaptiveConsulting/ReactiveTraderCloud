import React from 'react';
import { Router, Route, IndexRoute } from 'react-router';
import CoreLayout from 'layouts/core-layout';
import IndexView from 'views/index-view';
import GrowlView from 'views/growl-view';
import TileView from 'views/tile-view';

import { createHashHistory } from 'history';

const history = createHashHistory({
  queryKey: false
});

/**
 * Routes supported
 * @type {XML}
 */
const routes = (
  <Router history={history}>
    <Route path='/' component={CoreLayout}>
      <IndexRoute component={IndexView}/>
    </Route>
    <Route path='/user' component={CoreLayout}>
      <IndexRoute component={IndexView}/>
    </Route>
    <Route path='/tile'>
      <IndexRoute component={TileView}/>
    </Route>
    <Route path='/growl'>
      <IndexRoute component={GrowlView}/>
    </Route>
  </Router>
);

export default routes;
