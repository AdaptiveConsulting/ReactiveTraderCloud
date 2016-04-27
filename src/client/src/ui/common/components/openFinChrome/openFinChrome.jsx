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
      var toolbar = this.currentWindow.contentWindow.document.getElementById('open-fin-chrome');
      this.currentWindow.defineDraggableArea(toolbar);
    });
  }

  render() {
    return (
      <div id='open-fin-chrome'>
        <div className='open-fin-chrome__title'>Adaptive&#39;s Reactive Trader</div>
        <a onClick={() => this.props.minimize()}><i className='fa fa-minus fa-set-position'></i></a>
        <a onClick={() => this.props.maximize()}><i className='fa fa-square-o'></i></a>
        <a onClick={() => this.props.close()}><i className='fa fa-close'></i></a>
      </div>
    );
  }
}
