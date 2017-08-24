import ReactDOM from 'react-dom';
import React from 'react';
import TradeNotificationView from './ui/notification/tradeNotificationView';

export default class NotificationBootstrapper{

  run(){
    
    //OpenFin notifications API: need to define the global method onNotificationMessage
    window.onNotificationMessage = (message) => this._handleNotificationMessage(message);
  }

  _dismissNotification(){
    window.fin.desktop.Notification.getCurrent().close();
  }

  _handleNotificationMessage(message){
    ReactDOM.render(<TradeNotificationView message={message} dismissNotification={this._dismissNotification}/>, document.getElementById('root'));
    //send a message back to the main application - required to restore the main application window if it's minimised
    window.fin.desktop.Notification.getCurrent().sendMessageToApplication('ack');
  }
}

new NotificationBootstrapper().run();
