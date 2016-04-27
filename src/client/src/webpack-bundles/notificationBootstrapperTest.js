import ReactDOM from 'react-dom';
import React from 'react';
import TradeNotificationView from './tradeNotificationViewTest';

export default class NotificationBootstrapper{

  constructor(){
    window.onNotificationMessage = (message) => this.handleNotificationMessage(message);
  }

  dismissNotification(){
    window.fin.desktop.Notification.getCurrent().close();
  }

  handleNotificationMessage(message){
    ReactDOM.render(<TradeNotificationView message={message} dismissNotification={this.dismissNotification}/>, document.getElementById('root'));
    //send a message back to the main application - required to restore the main application window if it's minimised
    window.fin.desktop.Notification.getCurrent().sendMessageToApplication('ack');
  }
}
