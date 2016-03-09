import React from 'react';
import '../../common/styles/reactive-trader.scss';

export default class PageContainer extends React.Component {
  static propTypes = {
    children: React.PropTypes.element
  }

  render(){
    return (
      <div className='page-container'>
        <div className='view-container'>
          {this.props.children}
        </div>
      </div>
    );
  }
}
