import _ from 'lodash';
import React from 'react';
import { ViewBase } from '../../../common';
import { PopoutRegionModel, PopoutRegistration } from '../model';
import { router } from '../../../../system';

export default class PopoutRegionView extends ViewBase {
  constructor() {
    super();
    this.state = {
      model: null,
      // we only have 1 popout region so we hard code the model id here
      modelId:'popoutRegionModelId'
    };
  }

  render(){
    let model:PopoutRegionModel = this.state.model;
    if(model === null) {
      return null;
    }
    let popouts = this._createPopouts(model.popouts);
    return (
      <div>
        {popouts}
      </div>
    );
  }
  _createPopouts(popoutRegistrations:Array<PopoutRegistration>) {
    return _.map(popoutRegistrations, (popoutRegistration:PopoutRegistration) => {
      return <h1>{popoutRegistration.modelId}</h1>; // TODO replace with react-popup
    });
  }
}
