import React from 'react';
import { Router } from 'esp-js';
import { RouterProvider, SmartComponent } from 'esp-js-react';
import { RegionModel, RegionOptions, RegionModelRegistration } from './';
import { getPopoutService, PopoutOptions } from '../../common/popout';
import { ModelBase } from '../../common';

export default class PopoutRegionModel extends RegionModel {

  constructor(modelId:string, regionName:string, router:Router, openfin) {
    super(modelId, regionName, router);
    this._popoutService = getPopoutService(openfin);
  }

  // override
  _addToRegion(model:ModelBase, options:?RegionOptions) : RegionModelRegistration {
    let modelRegistration = super._addToRegion(model, options);
    let regionSettings = modelRegistration.regionSettings || {};
    let width = regionSettings.width || 400;
    let view = this._createViewElement(modelRegistration);
    let height = regionSettings.height || 400;
    let dockable = regionSettings.dockable || false;
    const title = options.regionSettings && options.regionSettings.title ? options.regionSettings.title : '';
    let popoutOptions = new PopoutOptions(
      modelRegistration.key,
      '/#/popout',
      title,
      () => this._popoutClosed(modelRegistration.model),
      {
        width,
        height,
        resizable: false,
        scrollable: false,
        dockable
      }
    );
    this._popoutService.openPopout(popoutOptions, view);
    return modelRegistration;
  }

  _popoutClosed(model) {
    this.router.publishEvent(this.modelId, 'removeFromRegion', {model: model});
  }

  _createViewElement(modelRegistration) {
    let child =  React.createElement(
      SmartComponent, {
        modelId: modelRegistration.model.modelId,
        displayContext:modelRegistration.displayContext
      }
    );
    // Wrap the SmartComponent in a RouterProvider so the SmartComponent
    // can access the router from it's context as expected.
    // We need to do this as the popout doesn't exist within the main VDOM thus won't have
    // context from the RouterProvider wrapping the main VDOM.
    return React.createElement(RouterProvider, {router:this.router}, child);
  }
}
