import React from 'react';
import './openFinChrome.scss';

export default class OpenFinChrome extends React.Component {

  static propTypes = {
    minimize: React.PropTypes.func.isRequired,
    maximize: React.PropTypes.func.isRequired,
    close: React.PropTypes.func.isRequired
  };

  componentDidMount() {
    fin.desktop.main(() => {
      this.currentWindow = fin.desktop.Window.getCurrent();
      const toolbar = this.currentWindow.contentWindow.document.getElementsByClassName('open-fin-chrome__bar')[0];
      this.currentWindow.defineDraggableArea(toolbar);
    });
  }

  render() {
    return (
      <div id='open-fin-chrome'>
        <div className='open-fin-chrome__bar'>
          <div className='open-fin-chrome__title'><span className='open-fin-chrome__title--brand'>Adaptive&#39;s Reactive Trader</span></div>
          <div className='open-fin-chrome__controls-container'>
            <ul className='open-fin-chrome__controls'>
              <li className='open-fin-chrome__control'><a onClick={() => this.props.minimize()}><i className='fa fa-minus fa-set-position'></i></a></li>
              <li className='open-fin-chrome__control'><a onClick={() => this.props.maximize()}><i className='fa fa-square-o'></i></a></li>
              <li className='open-fin-chrome__control'><a onClick={() => this.props.close()}><i className='fa fa-close'></i></a></li>
            </ul>
          </div>
        </div>
      </div>
    );
  }
}
