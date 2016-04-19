// ***********
// Note I've forked react-popoup here until https://github.com/JakeGinnivan/react-popout is addressed
// ***********

//The MIT License (MIT)
//
//Copyright (c) 2015 Jake Ginnivan
//
//Permission is hereby granted, free of charge, to any person obtaining a copy
//of this software and associated documentation files (the "Software"), to deal
//in the Software without restriction, including without limitation the rights
//to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
//copies of the Software, and to permit persons to whom the Software is
//furnished to do so, subject to the following conditions:
//
//The above copyright notice and this permission notice shall be included in all
//copies or substantial portions of the Software.
//
//THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
//IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
//FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
//AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
//LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
//OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
//SOFTWARE.
import React        from 'react';
import ReactDOM     from 'react-dom';
const _CONTAINER_ID = Symbol('container_id');

/**
 * @class PopoutWindow
 */
export default class PopoutWindow extends React.Component {

  /**
   * @type {{title: *, url: *, onClosing: *, options: *, window: *, containerId: *}}
   */
  static propTypes = {
    title: React.PropTypes.string.isRequired,
    url: React.PropTypes.string,
    onClosing: React.PropTypes.func,
    options: React.PropTypes.object,
    window: React.PropTypes.object,
    containerId: React.PropTypes.string,
    children: React.PropTypes.element
  };

  state = {
    openedWindow: null
  };

  defaultOptions = {
    toolbar: 'no',
    location: 'no',
    directories: 'no',
    status: 'no',
    menubar: 'no',
    scrollbars: 'yes',
    resizable: 'yes',
    width: 500,
    height: 400,
    top: (o, w) => ((w.innerHeight - o.height) / 2) + w.screenY,
    left: (o, w) => ((w.innerWidth - o.width) / 2) + w.screenX
  };

  /**
   * @constructs PoppoutWindow
   * @param props
   */
  constructor(props){
    super(props);
    this[_CONTAINER_ID] = props.containerId || 'popout-content-container';
    this.closeWindow = this.closeWindow.bind(this);
  }

  /**
   * Override default id if we get given one
   * @param props
   */
  componentWillReceiveProps(props){
    props.containerId && (this[_CONTAINER_ID] = props.containerId);
  }

  componentWillUnmount(){
    this.closeWindow();
  }

  componentDidMount(){
    let popoutWindow,
        container;

    const options      = Object.assign({}, this.defaultOptions, this.props.options),
          ownerWindow  = this.props.window || window,
          openedWindow = {
            update(newComponent){
              ReactDOM.render(newComponent, container);
            },
            close(){
              popoutWindow && popoutWindow.close();
            }
          };

    if (!ownerWindow) {
      // If we have no owner windows, bail. Likely server side render
      return;
    }

    const createOptions = () => {
      const ret = [];
      for (let key in options){
        options.hasOwnProperty(key) && ret.push(key + '=' + (
            typeof options[key] === 'function' ?
              options[key].call(this, options, ownerWindow) :
              options[key]
          )
        );
      }
      return ret.join(',');
    };

    popoutWindow = ownerWindow.open(this.props.url || 'about:blank', this.props.title, createOptions());

    popoutWindow.onbeforeunload = () =>{
      container && ReactDOM.unmountComponentAtNode(container);
      this.windowClosing();
    };
    // Close any open popouts when page unloads/refeshes
    ownerWindow.addEventListener('unload', this.closeWindow);

    const onloadHandler = () =>{
      if (container){
        if (popoutWindow.document.getElementById(this[_CONTAINER_ID])) return;

        ReactDOM.unmountComponentAtNode(container);
        container = null;
      }

      popoutWindow.document.title = this.props.title;
      container = popoutWindow.document.createElement('div');
      container.id = this[_CONTAINER_ID];
      popoutWindow.document.body.appendChild(container);

      ReactDOM.render(this.props.children, container);
    };

    popoutWindow.onload = onloadHandler;
    // Just in case that onload doesn't fire / has fired already, we call it manually if it's ready.
    popoutWindow.document.readyState === 'complete' && onloadHandler();

    this.setState({openedWindow}); // eslint-disable-line 
  }

  closeWindow(){
    this.state.openedWindow && this.state.openedWindow.close();
    (this.props.window || window).removeEventListener('unload', this.closeWindow);
  }

  windowClosing(){
    this.props.onClosing && this.props.onClosing();
  }

  /**
   * Bubble changes
   */
  componentDidUpdate(){
    // For SSR we might get updated but there will be no openedWindow. Make sure openedWIndow exists before calling
    this.state.openedWindow && this.state.openedWindow.update(this.props.children);
  }

  render(){
    return <div></div>;
  }

}
