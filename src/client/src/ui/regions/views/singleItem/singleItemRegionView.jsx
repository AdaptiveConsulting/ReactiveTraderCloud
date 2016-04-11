import _ from 'lodash';
import React from 'react';
import { ViewBase } from '../../../common';
import { PageContainer } from '../../../common/components';
import { RegionModel, RegionModelRegistration } from '../../model';
import { createViewForModel } from '../../';
import { router } from '../../../../system';

export default class SingleItemRegionView extends ViewBase {
  constructor() {
    super();
    this.state = {
      model: null
    };
  }

  render() {
    let model:RegionModel = this.state.model;
    if (model === null || model.modelRegistrations.length !== 1) {
      return null;
    }
    let modelRegistration:RegionModelRegistration = model.modelRegistrations[0];
    let view = createViewForModel(modelRegistration.model, modelRegistration.displayContext);
    return ( <div>{view}</div>)
  }
}
