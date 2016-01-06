import React from 'react';

export default class Direction extends React.Component {

  static propTypes ={
    direction: React.PropTypes.string.isRequired,
    spread: React.PropTypes.string.isRequired
  }

  render(){
    return <div className={this.props.direction + ' direction'}>{this.props.spread}</div>;
  }

}
