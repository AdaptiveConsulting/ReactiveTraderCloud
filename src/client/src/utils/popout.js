import React                          from 'react';
import ReactDOM                       from 'react-dom';
import ReactPopout                    from 'react-popout';
import { assign, reduce, isFunction } from 'lodash';

const divId = 'popout-content-container';

class Popout extends ReactPopout {

  constructor(props){
    super(props);
  }

  componentDidMount(){
    window.fin && window.fin.desktop ? this.openOpenFinWindow() : this.openWindow();
  }

  attachEvents(win){
    let container,
        { document } = win,
        { title, children } = this.props;

    const api = {
      update(){},
      close(){}
    };

    win.addEventListener('beforeunload', () =>{
      container && ReactDOM.unmountComponentAtNode(container);
      this.windowClosing();
    });

    let onloadhandler = () =>{
      // Some browsers don't call onload in some cases for popup windows (looking at you firefox).
      // If anyone wants to make this better, that would be awesome
      if (container){
        let existing = document.getElementById();
        if (!existing){
          ReactDOM.unmountComponentAtNode(container);
          container = null;
        } else {
          return;
        }
      }

      document.title = title;
      container = document.createElement('div');
      container.id = divId;
      document.body.appendChild(container);
      ReactDOM.render(children, container);
      api.update = newComponent =>{
        ReactDOM.render(newComponent, container);
      };
      api.close = () => win.close();
    };

    win.addEventListener('load', onloadhandler);

    onloadhandler();

    return api;
  }

  openOpenFinWindow(){
    const win = new window.fin.desktop.Window(Object.assign({}, this.defaultOptions, this.props.options), () =>{
      this.setState({
        openedWindow: this.attachEvents(win.contentWindow)
      });
    });
  }

  openWindow(){
    let effectiveOptions = assign({}, this.defaultOptions, this.props.options),
      ownerWindow = this.props.window || window;

    let optionsString = reduce(effectiveOptions, (acc, opt, key) =>{
      let val, part;
      if (isFunction(opt)){
        val = opt(effectiveOptions, ownerWindow);
      } else {
        val = opt;
      }
      part = key + '=' + val;
      return !acc ? part : acc + ',' + part;
    }, '');

    const win = ownerWindow.open(this.props.url || 'about:blank', this.props.title, optionsString);
    this.setState({
      openedWindow: this.attachEvents(win)
    });
  }
}

export default Popout;
