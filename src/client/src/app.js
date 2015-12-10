import React from 'react';
import ReactDOM from 'react-dom';
import routes from './routes';

const target = document.getElementById('root');

window.fin && target.classList.add('openfin');
ReactDOM.render(routes, target);
