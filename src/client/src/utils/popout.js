import React              from 'react';
import ReactDOM           from 'react-dom';
import ReactPopout        from 'react-popout';

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
      update(newComponent){
        container && ReactDOM.render(newComponent, container);
      },
      close(){
        win.close();
      }
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

        ReactDOM.render(children, container);
      };

      routeHasFinishedLoading();
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

  /**
   * Opens a popup box via the OpenFin API
   */
  openOpenFinWindow(){
    const win = new window.fin.desktop.Window(Object.assign({}, this.props.options), () =>{
      this.setState({
        openedWindow: this.attachEvents(win.contentWindow)
      });
    });
  }

  /**
   * Opens a popup box via window.open API
   */
  openWindow(){
    let options     = Object.assign({}, this.defaultOptions, this.props.options),
        ownerWindow = this.props.window || window;

    /**
     * creates key=value pairs, joined by , as required by window.open api.
     * @param {Object} options
     * @returns {string}
     */
    const createOptions = (options:object) =>{
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

    const win = ownerWindow.open(this.props.url || 'about:blank', this.props.title, createOptions(options));
    this.setState({
      openedWindow: this.attachEvents(win)
    });
  }
}

export default Popout;
