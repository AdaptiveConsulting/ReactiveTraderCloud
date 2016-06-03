import React from 'react';
import './openFinChrome.scss';
import classnames from 'classnames';

export default class OpenFinChrome extends React.Component {

  static propTypes = {
    children: React.PropTypes.element.isRequired,
    minimize: React.PropTypes.func,
    maximize: React.PropTypes.func,
    close: React.PropTypes.func.isRequired,
    showHeaderBar: React.PropTypes.boolean
  };

  componentDidMount() {
    fin.desktop.main(() => {
      this.currentWindow = fin.desktop.Window.getCurrent();
      const toolbar = this.currentWindow.contentWindow.document.getElementsByClassName('openfin-chrome__header')[0];
      this.currentWindow.defineDraggableArea(toolbar);
    });
  }

  render() {
    let headerClasses = classnames('openfin-chrome__header', {
      'openfin-chrome__header--no-bar' : this.props.showHeaderBar === false
    });
    let contentClasses = classnames('openfin-chrome__content', {
      'openfin-chrome__content--no-header-bar' : this.props.showHeaderBar === false
    });
    return (
      <div className='openfin-chrome'>
        <div className={headerClasses}>
          <div className='openfin-chrome__header-title'><span className='openfin-chrome__header-title-label'>Adaptive&#39;s Reactive Trader</span></div>
          <div className='openfin-chrome__header-controls-container'>
            <ul className='openfin-chrome__header-controls'>
              {this.props.minimize ? <li className='openfin-chrome__header-control'><a onClick={() => this.props.minimize()}><i className='fa fa-minus fa-set-position'></i></a></li> : null}
              {this.props.maximize ? <li className='openfin-chrome__header-control'><a onClick={() => this.props.maximize()}><i className='fa fa-square-o'></i></a></li> : null}
              <li className='openfin-chrome__header-control'><a onClick={() => this.props.close()}><i className='fa fa-close'></i></a></li>
            </ul>
          </div>
        </div>
        <div className={contentClasses}>
          {this.props.children}
        </div>
      </div>
    );
  }
}
