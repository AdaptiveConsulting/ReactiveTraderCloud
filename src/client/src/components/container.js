import React from 'react';
import Popout from '../utils/popout';

class Container extends React.Component {

  static propTypes = {
    onTearoff: React.PropTypes.func,
    onClose: React.PropTypes.func,
    tearoff: React.PropTypes.bool
  }

  toggleTearoff(e){
    e && e.preventDefault();
    this.props.onTearoff(!this.props.tearoff);
  }

  render(){
    const tearoff = this.props.tearoff,
          title = this.props.title;

    const popupAttributes = {
      url: '/#/tile',
      title: title
    };

    if (window.fin){
      popupAttributes.options = {
        url: '/#/tile',
        title: title,
        name: title,
        defaultWidth: 332,
        defaultHeight: 191,
        resizable: false,
        scrollable: false,
        frame: false,
        autoShow: true
      };
    }
    else {
      popupAttributes.options = {
        width: 332,
        height: 190,
        resizable: false,
        scrollable: false
      };
      popupAttributes.onClosing = ()=> this.toggleTearoff();
    }

    return !tearoff ?
      <div className={this.props.className}>
        <div className='container-control'>
          <i className='tearoff-trigger glyphicon glyphicon-new-window' onClick={(e) => this.toggleTearoff(e)}/>
        </div>
        {this.props.children}
      </div> :
      <Popout {...popupAttributes}>
        <div className={this.props.className}>
          <div className='container-control'>
            <i className='glyphicon glyphicon-remove' onClick={(e) => this.toggleTearoff(e)}/>
          </div>
          {this.props.children}
        </div>
      </Popout>;
  }

}

export default Container;
