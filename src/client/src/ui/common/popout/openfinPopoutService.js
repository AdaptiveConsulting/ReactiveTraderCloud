import React from 'react';
import ReactDOM from 'react-dom';
import {PopoutOptions} from './';
import {logger} from '../../../system';
import {OpenFinChrome} from '../components/';

let _log:logger.Logger = logger.create('OpenfinPopoutService');

export default class OpenfinPopoutService {

  constructor(openFin) {
    this._openFin = openFin;
  }

  openPopout({url, title, onClosing, windowOptions = { height: 400, width: 400 }}:PopoutOptions, view:React.Component) {
    this._createWindow({url, title, windowOptions}, tearoutWindow => {
      const popoutContainer = tearoutWindow.contentWindow.document.createElement('div');
      tearoutWindow.contentWindow.document.body.appendChild(popoutContainer);
      ReactDOM.render(<div>
          <OpenFinChrome minimize={() => this._openFin.minimise(tearoutWindow)}
                         maximize={() => this._openFin.maximise(tearoutWindow)}
                         close={() => {
                          this._openFin.close(tearoutWindow);
                          if (popoutContainer) {
                            ReactDOM.unmountComponentAtNode(popoutContainer);
                          }
                          if (onClosing) {
                            onClosing();
                          }
                        }}/>
          {view}
        </div>
        , popoutContainer);
      const toolbar = tearoutWindow.contentWindow.document.getElementById('open-fin-chrome');
      tearoutWindow.defineDraggableArea(toolbar);
      tearoutWindow.resizeTo(windowOptions.width, windowOptions.height + 30);
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
        showTaskbarIcon: false,
        alwaysOnTop: true
      },
      () => onSuccessCallback(tearoutWindow),
      err => onErrorCallback(err)
    );
  }
}
