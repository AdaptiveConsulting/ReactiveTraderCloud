import { RegionModel } from './model';
import { ModelBase } from '../common';
import { Guard } from '../../system';

export default class RegionManager {
  _regionsByName:{ [regionName: string] : RegionModel };

  constructor(regions:Array<RegionModel>) {
    this._regionsByName = {};
    regions.forEach(region => {
      this._regionsByName[region.regionName] = region;
    });
  }

  addToRegion(
    regionName:string,
    model:ModelBase,
    options?: {
      displayContext?:string,
      onExternallyRemovedCallback:?() => void,
      regionSettings:any
    }
  ) {
    var region : RegionModel = this._regionsByName[regionName];
    Guard.isDefined(region, `region with name ${regionName} not registered`);
    region.addToRegion(model, options);
  }

  removeFromRegion(regionName:string, model:ModelBase, displayContext:?string) {
    var region : RegionModel = this._regionsByName[regionName];
    Guard.isDefined(region, `region with name ${regionName} not registered`);
    region.removeFromRegion(model, displayContext);
  }
}
