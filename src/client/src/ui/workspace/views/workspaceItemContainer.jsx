import React from 'react';
import './workspaceItemContainer.scss';

// for tearoff render view, go here:
const url = '/#/tile';

class WorkspaceItemContainer extends React.Component {

  static propTypes = {
    onTearOff: React.PropTypes.func.isRequired,
    className: React.PropTypes.string
  };

  render(){
    return (
      <div className={this.props.className}>
        <div className='container-control'>
          <i className='tearoff-trigger glyphicon glyphicon-new-window' onClick={(e) => this._onTearOff(e)}/>
        </div>
        {this.props.children}
      </div>);
  }

  _onTearOff(e){
    e && e.preventDefault();
    this.props.onTearOff(true);
  }
}

export default WorkspaceItemContainer;
