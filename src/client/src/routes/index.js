import React from 'react';
import { Route, IndexRoute } from 'react-router';
import CoreLayout from 'layouts/core-layout';
import IndexView from 'views/index-view';

export default (
  <Route path='/' component={CoreLayout}>
    <IndexRoute component={IndexView} />
  </Route>
);
