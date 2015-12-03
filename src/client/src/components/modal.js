import React from 'react';
import utils from '../utils';
import emitter from '../utils/emitter';

// import {render} from 'react-dom';
let mountedInstance,
    defaultClassName = 'absolute-center modal text-center';

@utils.mixin(emitter)
class Modal extends React.Component {

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
    const show = 'show' in this.props ? this.props.show : this.state.show;

    return <div>
      <input ref='modal' type='checkbox' id='modal' className='hide' autoComplete='off' checked={show} onChange={() => this.close()}/>
      <div className={this.state.className}>
        <div className='modal-heading'>{this.state.title}
          <label htmlFor='modal'><i className='fa fa-times close' title='Close' /></label>
        </div>
        {typeof this.state.body === 'object' ? this.state.body :
          <div className='modal-body' dangerouslySetInnerHTML={{__html: this.state.body}}></div>}
      </div>
      <label className='blocker help-blocker' htmlFor='modal'/>
    </div>;
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
  trigger('title');
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
  trigger('body');
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
  this.trigger('open');
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
  this.trigger('close');
  return Modal;
};

// ensure it's rendered
//render(<Modal />, document.body);

export default Modal;
