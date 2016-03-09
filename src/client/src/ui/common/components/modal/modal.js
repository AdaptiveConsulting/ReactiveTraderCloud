import React from 'react';
import { utils } from 'system';
import classnames from 'classnames';

export default class Modal extends React.Component {

  static propTypes = {
    shouldShow: React.PropTypes.bool,
    title: React.PropTypes.string,
    additionalClassNames: React.PropTypes.string,
    children: React.PropTypes.element.isRequired
  };

  render() {
    if (!this.props.shouldShow) {
      return null;
    }
    let className = classnames(this.props.additionalClassNames, 'absolute-center', 'modal', 'text-center');

    //<input ref='modal'
    //       type='checkbox'
    //       id='modal'
    //       className='hide'
    //       autoComplete='off'
    //       checked={this.props.shouldShow}
    //       onChange={() => this.props.onDismissed()}/>
    //
    return (
      <div>
        <div className={className}>
          <div className='modal-heading'>{this.props.title}
            <label htmlFor='modal'>
              <i className='fa fa-times close' title='Close'/>
            </label>
          </div>
          {this.props.children}
        </div>
        <label className='blocker help-blocker' htmlFor='modal'/>
      </div>
    );
  }
};
