import React from 'react';
import ReactDOM from 'react-dom';
import PopoutServiceBase from './popoutServiceBase';
import _ from 'lodash';
import logger from '../../../system/logger';

var _log = logger.create('BlotterModel');

export default class BrowserPopoutService extends PopoutServiceBase {
  constructor() {
    super();
  }

  openPopout(options, view) {
    let popoutContainer;
    let windowOptionsString = this._getWindowOptionsString(options.windowOptions);
    _log.debug(`Opening child window url:${options.url},title:${options.title}`);
    let childWindow = window.open(options.url, options.title, windowOptionsString);
    let onloadHandler = () => {
      _log.debug(`Popout window loading`);
      childWindow.document.title = options.title;
      popoutContainer = childWindow.document.createElement('div');
      popoutContainer.id = this._popoutContainerId;
      childWindow.document.body.appendChild(popoutContainer);
      ReactDOM.render(view, popoutContainer);
    };
    childWindow.onbeforeunload = () => {
      if (popoutContainer) {
        ReactDOM.unmountComponentAtNode(popoutContainer);
      }

      if (_.isFunction(options.onClosing)) {
        options.onClosing();
      }
    };
    childWindow.onload = onloadHandler;
  }

  _getWindowOptionsString(options = {height: 400, width: 400}) {
    const top = ((window.innerHeight - options.height) / 2) + window.screenY;
    const left = ((window.innerWidth - options.width) / 2) + window.screenX;
    const windowOptions = Object.assign({
      top,
      left
    }, options);

    return Object.keys(windowOptions)
                .map(key => `${key}=${this._mapWindowOptionValue(windowOptions[key])}`)
                .join(',');
  }

  _mapWindowOptionValue(value) {
    if (_.isBoolean(value)) {
      return value ? 'yes' : 'no';
    }
    return value;
  }
}
