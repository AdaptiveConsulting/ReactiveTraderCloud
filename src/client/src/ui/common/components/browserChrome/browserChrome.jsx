import React from 'react';
import './browserChrome.scss';

export default class BrowserChrome extends React.Component {

  static propTypes = {
    children: React.PropTypes.element.isRequired
  };

  render() {
    return (
      <div className='browser-chrome__container'>
        {this.props.children}
      </div>
    );
  }
}
