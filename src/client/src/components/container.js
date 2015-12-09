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
    this.props.onTearoff();
  }

  render(){
    const tearoff = this.props.tearoff,
          title = this.props.title,
          popupAttributes = {
            url: '/tile',
            title: title,
            options: {
              width: 332,
              height: 190,
              resizable: false,
              scrollable: false
            },
            onClosing: ()=> this.toggleTearoff()
          };

      window.fin && Object.assign(popupAttributes.options, {
        url: '/tile',
        title: title,
        name: title,
        defaultWidth: 342,
        defaultHeight: 191,
        resizable: false,
        scrollable: false,
        frame: false,
        autoShow: true
      });

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
            <i className='glyphicon glyphicon-remove pull-right' onClick={(e) => this.toggleTearoff(e)}/>
          </div>
          {this.props.children}
        </div>
      </Popout>;
  }

}

export default Container;
