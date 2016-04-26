import { Router } from 'esp-js/src';
import { RegionModel, RegionOptions, RegionModelRegistration } from './';
import { ReactPopoutService, PopoutOptions } from '../../common/popout';
import { ModelBase } from '../../common';
import { createViewForModel } from '../';

export default class PopoutRegionModel extends RegionModel {
  _reactPopoutService:ReactPopoutService;

  constructor(modelId:string, regionName:string, router:Router) {
    super(modelId, regionName, router);
    this._reactPopoutService = new ReactPopoutService();
  }

  // override
  _addToRegion(model:ModelBase, options:?RegionOptions) : RegionModelRegistration {
    let modelRegistration = super._addToRegion(model, options);
    let view = createViewForModel(modelRegistration.model, modelRegistration.displayContext);
    let width = modelRegistration.regionSettings && modelRegistration.regionSettings.width
      ? modelRegistration.regionSettings.width
      : 400;
    let height = modelRegistration.regionSettings && modelRegistration.regionSettings.height
      ? modelRegistration.regionSettings.height
      : 400;
    var title = options.regionSettings && options.regionSettings.title ? options.regionSettings.title : '';
    let popoutOptions = new PopoutOptions(
      modelRegistration.key,
      '/#/popout',
      title,
      () => this._popoutClosed(modelRegistration.model),
      {
        width: width,
        height: height,
        resizable: 'no',
        scrollable: 'no'
      }
    );
    this._reactPopoutService.openPopout(popoutOptions, view);
    return modelRegistration;
  }

  _popoutClosed(model) {
    this.router.publishEvent(this.modelId, 'removeFromRegion', {model: model});
  }
}
