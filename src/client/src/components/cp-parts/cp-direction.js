import React from 'react';

export default class Direction extends React.Component {
  render(){
    return <div className={this.props.direction + ' direction'}>{this.props.spread}</div>;
  }
}
