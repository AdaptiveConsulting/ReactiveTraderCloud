import React from 'react';
import Notification from './notification';
import { TradeNotification } from '../../services/model';
import './notification.scss';

export default class NotificationView extends React.Component {

  state = {
    message: ''
  };

  componentDidMount(){
    window.onNotificationMessage = (message) => this.handleMessage(message);
  }
  
  handleMessage(message){
    this.setState({
      message: message
    });
  }

  render(){
    return (
      <div className='notification__container'>
        <Notification message={this.state.message}/>
      </div>
    );
  }
}
