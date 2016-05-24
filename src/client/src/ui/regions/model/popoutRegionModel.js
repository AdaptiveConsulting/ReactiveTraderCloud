import { Router } from 'esp-js/src';
import { RegionModel, RegionOptions, RegionModelRegistration } from './';
import { getPopoutService, PopoutOptions } from '../../common/popout';
import { ModelBase } from '../../common';
import { createViewForModel } from '../';

export default class PopoutRegionModel extends RegionModel {

  constructor(modelId:string, regionName:string, router:Router, openfin) {
    super(modelId, regionName, router);
    this._popoutService = getPopoutService(openfin);
  }

  // override
  _addToRegion(model:ModelBase, options:?RegionOptions) : RegionModelRegistration {
    let modelRegistration = super._addToRegion(model, options);
    let regionSettings = modelRegistration.regionSettings || {};
    let view = createViewForModel(modelRegistration.model, modelRegistration.displayContext);
    let width = regionSettings.width || 400;
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
}
