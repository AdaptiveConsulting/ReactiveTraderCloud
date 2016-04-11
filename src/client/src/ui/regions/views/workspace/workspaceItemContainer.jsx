import React from 'react';
import './workspaceItemContainer.scss';

export default class WorkspaceItemContainer extends React.Component {

  render(){
    return (
      <div>
        {this.props.children}
      </div>);
  }
}
