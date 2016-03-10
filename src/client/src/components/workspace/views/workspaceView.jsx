import React from 'react';
import { router } from '../../../system';
import { ViewBase } from '../../common';
import { WorkspaceItem } from '../model';
import WorkspaceItemContainer from './workspaceItemContainer.jsx';

export default class WorkspaceView extends ViewBase {
  constructor() {
    super();
    this.state = {
      model: null
    }
  }

  render() {
    if(!this.state.model) {
      return null;
    }
    let workspaceItems = this.state.model.workspaceItems;
    return (
      <div className='currency-pairs'>
        {
          workspaceItems.length
            ? this._renderWorkspaceItems(workspaceItems)
            : <div className='text-center'><i className='fa fa-5x fa-cog fa-spin'/></div>
        }
        <div className='clearfix'></div>
      </div>);
  }

  _renderWorkspaceItems(workspaceItems) {
    return workspaceItems.map((item:WorkspaceItem) => {
      return (
        <WorkspaceItemContainer
          key={item.key}
          onTearOff={() => router.publishEvent(this.props.modelId, 'tearOffWorkspaceItem', {itemId:item.key})}>
          {item.view}
        </WorkspaceItemContainer>
      );
    });
  }
}
