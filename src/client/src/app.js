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

const routes = (
  <Router history={history}>
    <Route path='/' component={ui.shell.components.CoreLayout}>
      <IndexRoute component={ui.shell.components.ShellView}/>
    </Route>
    <Route path='/user' component={ui.shell.components.CoreLayout}>
      <IndexRoute component={ui.shell.components.ShellView}/>
    </Route>
    <Route path='/tile'>
      <IndexRoute component={ui.shell.components.TileView}/>
    </Route>
    <Route path='/growl'>
      <IndexRoute component={ui.growl.components.GrowlView}/>
    </Route>
  </Router>
);

ReactDOM.render(routes, target);
