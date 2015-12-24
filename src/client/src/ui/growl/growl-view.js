import React from 'react';
import { Message } from '../common';

class GrowlView extends React.Component {

  constructor(props, context){
    super(props, context);
    this.state = {
      message: ''
    };
  }

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
      <div className='growl'>
        <Message message={this.state.message} onClick={this.handleClick}/>
      </div>
    );
  }
}

export default GrowlView;
