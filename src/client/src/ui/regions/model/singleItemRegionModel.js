import { Router } from 'esp-js/src';
import { RegionModelRegistration } from './';
import RegionModel from './regionModel';

export default class SingleItemRegionModel extends RegionModel {

  constructor(modelId:string, regionName:string, router:Router) {
    super(modelId, regionName, router);
  }

  // override
  addToRegion(model:ModelBase, onExternallyRemovedCallback:?() => void, context:?string) {
    this.ensureOnDispatchLoop(()=> {
      if (this.modelRegistrations.length === 1) {
        let regionModelRegistration : RegionModelRegistration = this.modelRegistrations[0];
        this._removeFromRegion(regionModelRegistration.model, true);
      }
      this.modelRegistrations.length = 0;
      super.addToRegion(model, onExternallyRemovedCallback);
    });
  }
}
