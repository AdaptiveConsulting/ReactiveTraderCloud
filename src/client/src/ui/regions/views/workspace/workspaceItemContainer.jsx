import React from 'react';
import './workspaceItemContainer.scss';

export default class WorkspaceItemContainer extends React.Component {

  render(){
    return (
      <div className='workspace-region__item'>
        {this.props.children}
      </div>);
  }
}
