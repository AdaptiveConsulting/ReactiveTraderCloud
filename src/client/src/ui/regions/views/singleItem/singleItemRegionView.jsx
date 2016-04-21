import React from 'react';
import { ViewBase } from '../../../common';
import { RegionModel, RegionModelRegistration } from '../../model';
import { createViewForModel } from '../../';

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
    return view;
  }
}
