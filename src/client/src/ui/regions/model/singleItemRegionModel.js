import { Router } from 'esp-js';
import { RegionModel, RegionOptions, RegionModelRegistration } from './';
import { ModelBase } from '../../common';

export default class SingleItemRegionModel extends RegionModel {

  constructor(modelId:string, regionName:string, router:Router) {
    super(modelId, regionName, router);
  }

  // override
  _addToRegion(model:ModelBase, options?:RegionOptions) : RegionModelRegistration {
    if (this.modelRegistrations.length === 1) {
      let regionModelRegistration : RegionModelRegistration = this.modelRegistrations[0];
      this._removeFromRegion(regionModelRegistration.model, true);
    }
    this.modelRegistrations.length = 0;
    return super._addToRegion(model, options);
  }
}
