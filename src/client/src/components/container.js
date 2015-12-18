import React from 'react';
import Popout from '../utils/popout';

class Container extends React.Component {

  static propTypes = {
    onTearoff: React.PropTypes.func.isRequired,
    onClose: React.PropTypes.func,
    tearoff: React.PropTypes.bool.isRequired,
    title: React.PropTypes.string.isRequired,
    width: React.PropTypes.number,
    height: React.PropTypes.number,
    options: React.PropTypes.object,
    className: React.PropTypes.string
  }

  openTearoff(e){
    e && e.preventDefault();
    this.props.onTearoff(true);
  }

  closeTearoff(e){
    e && e.preventDefault();
    this.props.onTearoff(false);
  }

  render(){
    const { tearoff, title, children}  = this.props; //eslint-disable-line

    const popupAttributes = {
      url: '/#/tile',
      title: title
    };

    if (window.fin){
      popupAttributes.options = Object.assign({}, {
        url: '/#/tile',
        title: title,
        name: title,
        defaultWidth: this.props.width || 332,
        defaultHeight: this.props.height || 191,
        resizable: false,
        scrollable: false,
        maximizable: false,
        frame: false,
        autoShow: true
      }, this.props.options);
    }
    else {
      popupAttributes.options = {
        width: this.props.width || 332,
        height: this.props.height || 190,
        resizable: false,
        scrollable: false
      };
      popupAttributes.onClosing = ()=> this.closeTearoff();
    }

    return !tearoff ?
      <div className={this.props.className}>
        <div className='container-control'>
          <i className='tearoff-trigger glyphicon glyphicon-new-window' onClick={(e) => this.openTearoff(e)} />
        </div>
        {children}
      </div> :
      <Popout {...popupAttributes}>
        <div className={this.props.className}>
          <div className='container-control'>
            <i className='glyphicon glyphicon-remove' onClick={(e) => this.closeTearoff(e)} />
          </div>
          {children}
        </div>
      </Popout>;
  }

}

export default Container;
