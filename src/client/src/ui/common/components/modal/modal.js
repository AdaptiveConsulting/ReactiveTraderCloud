import React from 'react';
import { utils } from 'system';

let mountedInstance;
let defaultClassName = 'absolute-center modal text-center';

export default class Modal extends React.Component {

  static propTypes = {
    show: React.PropTypes.bool,
    title: React.PropTypes.string,
    body: React.PropTypes.any,
    className: React.PropTypes.string
  };

  constructor(props, context){
    super(props, context);
    this.state = {
      show: props.show,
      title: props.title || '',
      body: props.body || '',
      className: [defaultClassName, props.className].join(' ')
    };
  }

  /**
   * Expose instance for singleton control
   */
  componentDidMount(){
    mountedInstance = this;
  }

  close(){
    this.setState({
      show: false
    });
  }

  render(){
    const { show } = this.state;

    return (
        <div>
        <input ref='modal' type='checkbox' id='modal' className='hide' autoComplete='off' checked={show} onChange={() => this.close()}/>
        <div className={this.state.className}>
          <div className='modal-heading'>{this.state.title}
            <label htmlFor='modal'><i className='fa fa-times close' title='Close' /></label>
          </div>
          {typeof this.state.body === 'object' ? this.state.body :
            <div className='modal-body' dangerouslySetInnerHTML={{__html: this.state.body}}></div>}
        </div>
        <label className='blocker help-blocker' htmlFor='modal'/>
      </div>
    );
  }
};

/**
 * Set the title
 * @param title
 * @returns {Modal}
 */
Modal.setTitle = (title) => {
  mountedInstance.setState({
    title: title
  });
  return Modal;
};

/**
 * Set the body
 * @param body
 * @returns {Modal}
 */
Modal.setBody = (body) => {
  mountedInstance.setState({
    body: body
  });
  return Modal;
};

/**
 * Allows changes to className of modal
 * @param className
 */
Modal.setClass = (className) => {
  mountedInstance.setState({
    className: [defaultClassName, className].join(' ')
  });
  return Modal;
};

/**
 * Open the modal
 * @returns {Modal}
 */
Modal.open = () => {
  mountedInstance.setState({
    show: true
  });
  return Modal;
};

/**
 * Close the modal
 * @returns {Modal}
 */
Modal.close = () => {
  mountedInstance.setState({
    show: false
  });
  return Modal;
};
