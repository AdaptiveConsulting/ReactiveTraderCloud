import React from 'react';
import { Router } from 'esp-js';
import { SmartComponent } from 'esp-js-react';
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
    let view = this._createSmartComponent(modelRegistration);
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

  _createSmartComponent(modelRegistration) {
    /*eslint-disable */
    // as we're creating a <SmartComponent /> dynamically it's not going to have
    // access to the context that <RouterProvider /> would provided.
    // Given this we wrap it and provide the context here.
    let router = this.router;
    const wrapperWithContext = React.createClass({
      childContextTypes: { router: React.PropTypes.instanceOf(Router) },
      getChildContext() {
        return { router:router };
      },
      render() {
        return React.createElement(
          SmartComponent, {
            modelId: modelRegistration.model.modelId,
            displayContext:modelRegistration.displayContext
          }
        );
      },
    });
    /*eslint-enable */
    return React.createElement(wrapperWithContext);
  }
}
