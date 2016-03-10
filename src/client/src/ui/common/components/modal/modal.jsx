import React from 'react';
import { utils } from '../../../../system';

// TODO disable tabbing outside of the modal
export default class Modal extends React.Component {

  static propTypes = {
    shouldShow: React.PropTypes.bool,
    title: React.PropTypes.string,
    children: React.PropTypes.element.isRequired
  };

  render() {
    if (!this.props.shouldShow) {
      return null;
    }
    return (
      <div>
        <div className='modal-overlay'></div>
        <div className='absolute-center modal text-center'>
          <div className='modal-heading'>{this.props.title}</div>
          {this.props.children}
        </div>
      </div>
    );
  }
};
