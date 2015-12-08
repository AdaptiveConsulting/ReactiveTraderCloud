import React from 'react';

export default class Closer extends React.Component {
  render(){
    return <i className='fa fa-times pull-right' onClick={this.props.onClick} />;
  }
}
