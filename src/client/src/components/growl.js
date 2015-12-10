import React from 'react';

export default class Growl extends React.Component {
  static propTypes = {
    message: React.PropTypes.func
  }

  constructor(props, context){
    super(props, content);
    this.state = {
      message: ''
    };
  }

  componentDidMount(){
    window.onNotificationMessage = (message) => this.handleMessage(message);
  }

  handleMessage(message){
    this.setState({
      message
    });
  }

  render(){
    return <div>
      message
      {this.state.message}
    </div>;
  }
}
