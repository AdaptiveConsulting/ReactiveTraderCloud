import React from 'react';
import './openFinChrome.scss';

export default class OpenFinChrome extends React.Component {

  static propTypes = {
    children: React.PropTypes.element.isRequired,
    minimize: React.PropTypes.func.isRequired,
    maximize: React.PropTypes.func.isRequired,
    close: React.PropTypes.func.isRequired
  };

  componentDidMount() {
    fin.desktop.main(() => {
      this.currentWindow = fin.desktop.Window.getCurrent();
      const toolbar = this.currentWindow.contentWindow.document.getElementsByClassName('openfin-chrome__header')[0];
      this.currentWindow.defineDraggableArea(toolbar);
    });
  }

  render() {
    return (
      <div className='openfin-chrome'>
        <div className='openfin-chrome__header'>
          <div className='openfin-chrome__header-title'><span className='openfin-chrome__header-title--brand'>Adaptive&#39;s Reactive Trader</span></div>
          <div className='openfin-chrome__header-controls-container'>
            <ul className='openfin-chrome__header-controls'>
              <li className='openfin-chrome__header-control'><a onClick={() => this.props.minimize()}><i className='fa fa-minus fa-set-position'></i></a></li>
              <li className='openfin-chrome__header-control'><a onClick={() => this.props.maximize()}><i className='fa fa-square-o'></i></a></li>
              <li className='openfin-chrome__header-control'><a onClick={() => this.props.close()}><i className='fa fa-close'></i></a></li>
            </ul>
          </div>
        </div>
        <div className='openfin-chrome__content'>
          {this.props.children}
        </div>
      </div>
    );
  }
}
