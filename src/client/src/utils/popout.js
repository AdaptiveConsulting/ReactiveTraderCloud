import React                          from 'react';
import ReactDOM                       from 'react-dom';
import ReactPopout                    from 'react-popout';
import Closer from '../components/closer';
import { assign, reduce, isFunction } from 'lodash';

const CONTAINER_ID         = 'popout-content-container',
      ROOT_ANCHOR_SELECTOR = '#root .tile';

/**
 * @class Popout
 * @extends ReactPopout
 */
class Popout extends ReactPopout {

  /**
   * Strategy for opening can be via window.open or fin.desktop.Window(), which are not compatible
   */
  componentDidMount(){
    window.fin && window.fin.desktop ? this.openOpenFinWindow() : this.openWindow();
  }

  /**
   * Adds load and unload events to handle plumbing
   * @param {Window|fin.desktop.Window} win
   * @returns {{update: (function()), close: (function())}}
   */
  attachEvents(win){
    let container,
        { document } = win,
        { title, children } = this.props;

    const api = {
      update(){},
      close(){}
    };

    /**
     * callback when load has fired or readyState has fired
     */
    let onloadhandler = () =>{
      if (container){
        if (document.getElementById(CONTAINER_ID)) return;

        ReactDOM.unmountComponentAtNode(container);
        container = null;
      }

      container = document.createElement('div');
      container.id = CONTAINER_ID;

      // need to wait for nav to new route to finish, sometimes it can be slow.
      const routeHasFinishedLoading = () =>{
        let rootNode = win.document.querySelector(ROOT_ANCHOR_SELECTOR);

        // retry when possible.
        if (!rootNode) return window.requestAnimationFrame(routeHasFinishedLoading);

        rootNode.appendChild(container);

        document.body.classList.add('tearoff');
        window.fin && document.body.classList.add('openfin');

        document.title = title;
      };

      routeHasFinishedLoading();

      api.update = newComponent =>{
        ReactDOM.render(newComponent, container);
      };
      api.close = () => win.close();
    };

    win.addEventListener('load', onloadhandler);
    win.addEventListener('beforeunload', () =>{
      container && ReactDOM.unmountComponentAtNode(container);
      this.windowClosing();
    });

    // ensure it runs if already fired
    win.document.readyState == 'complete' && onloadhandler();

    return api;
  }

  openOpenFinWindow(){
    const win = new window.fin.desktop.Window(Object.assign({}, this.props.options), () =>{
      this.setState({
        openedWindow: this.attachEvents(win.contentWindow)
      });
    });
  }

  openWindow(){
    let effectiveOptions = assign({}, this.defaultOptions, this.props.options),
        ownerWindow      = this.props.window || window;

    let optionsString = reduce(effectiveOptions, (acc, opt, key) =>{
      const val = (isFunction(opt)) ? opt(effectiveOptions, ownerWindow) : opt;
      const part = key + '=' + val;
      return !acc ? part : acc + ',' + part;
    }, '');

    const win = ownerWindow.open(this.props.url || 'about:blank', this.props.title, optionsString);
    this.setState({
      openedWindow: this.attachEvents(win)
    });
  }
}

export default Popout;
