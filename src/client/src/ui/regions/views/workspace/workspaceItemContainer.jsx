import React from 'react';
import './workspaceItemContainer.scss';

export default class WorkspaceItemContainer extends React.Component {

  static propTypes = {
    children: React.PropTypes.element.isRequired
  };

  render(){
    return (
      <div className='workspace-region__item'>
        {this.props.children}
      </div>);
  }
}
