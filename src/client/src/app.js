import React from 'react';
import ReactDOM from 'react-dom';
import routes from './routes';

const target = document.getElementById('root');

if (window.fin) {
  target.classList.add('openfin');
  //fin.desktop.main(() => {
    //new window.fin.desktop.Notification({
    //  url: '/#/growl',
    //  message: 'hi'
    //});
  //});
}

ReactDOM.render(routes, target);