import React from 'react';
import ReactDOM from 'react-dom';
import {PopoutOptions} from './';
import {logger} from '../../../system';
import {OpenFinChrome} from '../components/';

let POPOUT_CONTAINER_ID = 'popout-content-container';

let _log:logger.Logger = logger.create('OpenfinPopoutService');

export default class OpenfinPopoutService {

  constructor(openFin) {
    this._openFin = openFin;
  }

  openPopout({title, onClosing, windowOptions = { height: 400, width: 400 }}:PopoutOptions = {}, view:React.Component) {
    this._createWindow(title, tearoutWindow => {
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

      tearoutWindow.resizeTo(windowOptions.width, windowOptions.height + 30);

      //tearoutWindow.updateOptions({opacity: 0, alwaysOnTop: true});
      tearoutWindow.show();
      tearoutWindow.animate({
        opacity: {
          opacity: 1,
          duration: 400
        }
      }, () => {
        tearoutWindow.bringToFront();
      });
    }, err => {
      alert('error:' + err);
    });
  }

  _createWindow(name, onSuccessCallback, onErrorCallback) {
    const tearoutWindow = new fin.desktop.Window({
        name,
        autoShow: false,
        url: '/popout.html',
        frame: false,
        resizable: false,
        maximizable: false,
        showTaskbarIcon: false,
        alwaysOnTop: true
      },
      () => {
        onSuccessCallback(tearoutWindow);
      },
      err => {
        onErrorCallback(err);
      }
    );
  }

}
