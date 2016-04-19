import React from 'react';
import { utils } from '../../../../system';
import './modal.scss';

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
        <div className='modal__overlay'></div>
        <div className='modal'>
          <div className='modal__header'><span className='modal__header-title'>{this.props.title}</span></div>
          <div className='modal__body'>
            {this.props.children}
          </div>
        </div>
      </div>
    );
  }
};
