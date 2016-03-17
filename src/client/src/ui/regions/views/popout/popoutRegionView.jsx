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
    let popouts = this._createPopouts(model.views);
    return (
      <div>
        {popouts}
      </div>
    );
  }
  _createPopouts(popoutRegistrations:Array<RegionModelRegistration>) {
    return _.map(popoutRegistrations, (regionModelRegistration:RegionModelRegistration) => {
      let view =createViewForModel(regionModelRegistration.model, regionModelRegistration.context);
      return (<Popout>
        {view}
      </Popout>);
    });
  }
}
