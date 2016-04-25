import React from 'react';
import Message from './notification';

export default class NotificationView extends React.Component {

  state = {
    message: ''
  };

  componentDidMount(){
    window.onNotificationMessage = (message) => this.handleMessage(message);
  }

  handleClick(){
    this.dismissMessage();
  }

  dismissMessage(){
    window.fin.desktop.Notification.getCurrent().close();
  }

  handleMessage(message){
    this.setState({
      message
    });
  }

  render(){
    return (
      <div className='notification'>
        {this.state.message ?
          <Message message={this.state.message} onClick={this.handleClick}/> :
          <div>Nothing</div>}
      </div>
    );
  }
}

