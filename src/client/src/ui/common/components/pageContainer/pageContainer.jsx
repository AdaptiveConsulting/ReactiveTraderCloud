import React from 'react';
import '../../styles/reactive-trader.scss';

export default class PageContainer extends React.Component {
  render() {
    return (<div>{this.props.children}</div>);
  }
}
