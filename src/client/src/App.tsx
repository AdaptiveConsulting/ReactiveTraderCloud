import * as React from 'react';
import * as ReactDOM from 'react-dom';

import { BrowserRouter as Router, Route } from 'react-router-dom';
import { applyMiddleware, createStore } from 'redux';
import { Provider } from 'react-redux';
import thunk from 'redux-thunk';
import { createLogger } from 'redux-logger';

import autobahnConnection from './services/autobahn';
import { MainContainer } from './ui/main';
import rootReducer from './reducers';

declare var process: any;
const env = process.env.NODE_ENV;
const middlewares: any[] = [thunk];

if (env === 'dev') {
  middlewares.push(createLogger());
}

const autobahnService = () => ({
  type: 'START_BOOTSTRAP',
  payload: autobahnConnection
});

const store = createStore(rootReducer, {}, applyMiddleware(...middlewares));
store.dispatch(autobahnService());

ReactDOM.render(
  <Provider store={store}>
    <Router>
      <div>
        <Route path="/" component={MainContainer} />
      </div>
    </Router>
  </Provider>,
  document.getElementById('root')
);
