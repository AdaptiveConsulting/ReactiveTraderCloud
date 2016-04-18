import _ from 'lodash';
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
    };
  }

  render() {
    if(!this.state.model) {
      return null;
    }
    let model : RegionModel = this.state.model;
    return (
      <div className='workspace-region'>
        {
          model.modelRegistrations.length > 0
            ? this._renderWorkspaceItems(model.modelRegistrations)
            : <div className='text-center'><i className='fa fa-5x fa-cog fa-spin'/></div>
        }
      </div>);
  }

  _renderWorkspaceItems(modelRegistrations:Array<RegionModelRegistration>) {
    return _.map(modelRegistrations, (modelRegistration:RegionModelRegistration) => {
      let View = createViewForModel(modelRegistration.model, modelRegistration.displayContext);
      return (
        <WorkspaceItemContainer
          key={modelRegistration.model.modelId}>
          {View}
        </WorkspaceItemContainer>
      );
    }).concat(_.times(3, () => <div className='workspace-region__spacer'></div>)); // add empty items at the end so tiles lay out nicely
  }
}
