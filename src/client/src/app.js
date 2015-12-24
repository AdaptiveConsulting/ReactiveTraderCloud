import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, IndexRoute } from 'react-router';
import { createHashHistory } from 'history';

import ui from './ui';

const history = createHashHistory({
  queryKey: false
});

const target = document.getElementById('root');

if (window.fin) {
  target.classList.add('openfin');
}

var coreLayout = ui.shell.components.CoreLayout;
var shellView = ui.shell.components.ShellView;
var tileView = ui.shell.components.TileView;
var growlView = ui.growl.components.GrowlView;

const routes = (
  <Router history={history}>
    <Route path='/' component={coreLayout}>
      <IndexRoute component={shellView}/>
    </Route>
    <Route path='/user' component={coreLayout}>
      <IndexRoute component={shellView}/>
    </Route>
    <Route path='/tile'>
      <IndexRoute component={tileView}/>
    </Route>
    <Route path='/growl'>
      <IndexRoute component={growlView}/>
    </Route>
  </Router>
);

ReactDOM.render(routes, target);
