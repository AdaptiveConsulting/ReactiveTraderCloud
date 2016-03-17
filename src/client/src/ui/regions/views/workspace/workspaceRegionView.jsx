import React from 'react';
import { router } from '../../../../system';
import { ViewBase } from '../../../common';
import { RegionModel, RegionModelRegistration } from '../../model';
import { createViewForModel} from '../../';
import WorkspaceItemContainer from './workspaceItemContainer.jsx';

export default class WorkspaceRegionView extends ViewBase {
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
    let model : RegionModel = this.state.model;
    return (
      <div className='currency-pairs'>
        {
          model.views.length
            ? this._renderWorkspaceItems(model.views)
            : <div className='text-center'><i className='fa fa-5x fa-cog fa-spin'/></div>
        }
        <div className='clearfix'></div>
      </div>);
  }

  _renderWorkspaceItems(registrations:Array<RegionModelRegistration>) {
    return registrations.map((registration:RegionModelRegistration) => {
      let view = createViewForModel(registration.model, registration.context);
      return (
        <WorkspaceItemContainer
          key={registration.model.modelId}>
          {view}
        </WorkspaceItemContainer>
      );
    });
  }
}
