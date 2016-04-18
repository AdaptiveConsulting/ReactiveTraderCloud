import React from 'react';
import '../../styles/reactive-trader.scss';

export default class PageContainer extends React.Component {

  static propTypes = {
    children: React.PropTypes.element.isRequired
  };

  render() {
    return (<div>{this.props.children}</div>);
  }
}
