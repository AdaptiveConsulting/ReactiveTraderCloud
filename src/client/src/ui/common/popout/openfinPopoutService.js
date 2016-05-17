import React from 'react';
import ReactDOM from 'react-dom';
import {PopoutOptions} from './';
import {logger} from '../../../system';
import {OpenFinChrome} from '../components/';
import PopoutServiceBase from './popoutServiceBase';
import _ from 'lodash';

let _log:logger.Logger = logger.create('OpenfinPopoutService');
const OPENFIN_CHROME_TOOLBAR_HEIGHT = 30;

export default class OpenfinPopoutService extends PopoutServiceBase {

  constructor(openFin) {
    super();
    this._openFin = openFin;
  }

  openPopout({url, title, onClosing, windowOptions = { height: 400, width: 400 }}:PopoutOptions, view:React.Component) {
    this._createWindow({url, title, windowOptions}, tearoutWindow => {
      const popoutContainer = tearoutWindow.contentWindow.document.createElement('div');
      tearoutWindow.contentWindow.document.body.appendChild(popoutContainer);
      ReactDOM.render(<div>
          <OpenFinChrome minimize={() => this._openFin.minimize(tearoutWindow)}
                         maximize={() => this._openFin.maximize(tearoutWindow)}
                         close={() => {
                          this._openFin.close(tearoutWindow);
                          if (popoutContainer) {
                            ReactDOM.unmountComponentAtNode(popoutContainer);
                          }
                          if (_.isFunction(onClosing)) {
                            onClosing();
                          }
                        }}/>
          {view}
        </div>
        , popoutContainer);
      const toolbar = tearoutWindow.contentWindow.document.getElementById('open-fin-chrome');
      tearoutWindow.defineDraggableArea(toolbar);
      tearoutWindow.resizeTo(windowOptions.width, windowOptions.height + OPENFIN_CHROME_TOOLBAR_HEIGHT);
      tearoutWindow.updateOptions({opacity: 0, alwaysOnTop: true});
      tearoutWindow.show();
      tearoutWindow.animate({
        opacity: {
          opacity: 1,
          duration: 400
        }
      }, () => tearoutWindow.bringToFront());
    }, err => _log.error(`An error occured while tearing out window: ${err}`));
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
}
