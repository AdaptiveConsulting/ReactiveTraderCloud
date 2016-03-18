import _ from 'lodash';
import React from 'react';
import { ViewBase } from '../../../common';
import { RegionModel, RegionModelRegistration } from '../../model';
import { createViewForModel } from '../../';
import { router } from '../../../../system';
import Popout from 'react-popout';

export default class PopoutRegionView extends ViewBase {
  constructor() {
    super();
    this.state = {
      model: null
    };
  }
  render(){
    let model:RegionModel = this.state.model;
    if(model === null) {
      return null;
    }
    let popouts = this._createPopouts(model.modelRegistrations);
    return (
      <div>
        {popouts}
      </div>
    );
  }
  _createPopouts(modelRegistrations:Array<RegionModelRegistration>) {
    return _.map(modelRegistrations, (modelRegistration:RegionModelRegistration) => {
      let view =createViewForModel(modelRegistration.model, modelRegistration.context);
      return (<Popout>
        {view}
      </Popout>);
    });
  }
}
