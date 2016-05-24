import React from 'react';
import ReactDOM from 'react-dom';
import { PopoutOptions } from './';
import { logger } from '../../../system';
import OpenFinChrome from '../../common/components/openFinChrome/openFinChrome';
import PopoutServiceBase from './popoutServiceBase';
import _ from 'lodash';
const DockingManager = require('exports?DockingManager!../../../../lib/dockingManager.js');

const DOCKED_CLASS_NAME = 'docked';

let _log:logger.Logger = logger.create('OpenfinPopoutService');

export default class OpenfinPopoutService extends PopoutServiceBase {

  constructor(openFin) {
    super();
    this._openFin = openFin;
    this._popouts = {};
    this._initializeDockingManager();
  }

  openPopout({url, title, onClosing, windowOptions = { height: 400, width: 400, dockable: false }}:PopoutOptions, view:React.Component) {
    this._createWindow({url, title, windowOptions}, tearoutWindow => {
      const popoutContainer = tearoutWindow.contentWindow.document.createElement('div');
      popoutContainer.id = this._popoutContainerId;
      tearoutWindow.contentWindow.document.body.appendChild(popoutContainer);
      ReactDOM.render(<OpenFinChrome
        minimize={() => this._openFin.minimize(tearoutWindow)}
        maximize={() => this._openFin.maximize(tearoutWindow)}
        close={() => {
          this._openFin.close(tearoutWindow);
          this._unregisterWindow(tearoutWindow);
          if (popoutContainer) {
            ReactDOM.unmountComponentAtNode(popoutContainer);
          }
          if (_.isFunction(onClosing)) {
            onClosing();
          }
        }}>
        {view}
      </OpenFinChrome>, popoutContainer);
      const toolbar = tearoutWindow.contentWindow.document.getElementsByClassName('openfin-chrome__header')[0];
      tearoutWindow.defineDraggableArea(toolbar);
      tearoutWindow.resizeTo(windowOptions.width, windowOptions.height);
      tearoutWindow.updateOptions({opacity: 0, alwaysOnTop: true});
      tearoutWindow.show();
      tearoutWindow.animate({
        opacity: {
          opacity: 1,
          duration: 300
        }
      }, () => tearoutWindow.bringToFront());
      this._registerWindow(tearoutWindow, windowOptions.dockable);
    }, err => _log.error(`An error occured while tearing out window: ${err}`));
  }

  undockPopout(windowName) {
    fin.desktop.InterApplicationBus.publish('undock-window', { windowName });
  }

  _createWindow({url, title, windowOptions}, onSuccessCallback, onErrorCallback) {
    const tearoutWindow = new fin.desktop.Window({
        name: title,
        autoShow: false,
        url,
        frame: false,
        resizable: windowOptions.resizable,
        maximizable: false,
        minimizable: true,
        showTaskbarIcon: true,
        alwaysOnTop: true
      },
      () => onSuccessCallback(tearoutWindow),
      err => onErrorCallback(err)
    );
  }

  _initializeDockingManager() {
    let _this = this;
    fin.desktop.main(() => {
      this._dockingManager = new DockingManager();
      fin.desktop.InterApplicationBus.subscribe('*', 'window-docked', ({windowName}) => {
        const tearoutWindow = _this._popouts[windowName];
        if (tearoutWindow) {
          let container = tearoutWindow.contentWindow.document.getElementsByClassName('openfin-chrome__content')[0];
          container.className += ` ${DOCKED_CLASS_NAME}`;
          _log.info(`Docking ${tearoutWindow.name}`);
        }
      });
      fin.desktop.InterApplicationBus.subscribe('*', 'window-undocked', ({windowName}) => {
        const tearoutWindow = _this._popouts[windowName];
        if (tearoutWindow) {
          let container = tearoutWindow.contentWindow.document.getElementsByClassName('openfin-chrome__content')[0];
          container.className = container.className.replace(new RegExp(DOCKED_CLASS_NAME, 'g'), '');
          _log.info(`Undocking ${tearoutWindow.name}`);
        }
      });
    });
  }


  _registerWindow(tearoutWindow, dockable) {
    if (this._dockingManager) {
      this._dockingManager.register(tearoutWindow, dockable);
      this._popouts[tearoutWindow.name] = tearoutWindow;
    }
  }

  _unregisterWindow({name}) {
    // ensure other popouts are notified in case the window is docked
    this.undockPopout(name);
    delete this._popouts[name];
  }
}
