import { RegionModel } from './model';
import { ModelBase } from '../common';
import { Guard } from '../../system';
import { logger } from '../../system';

const REGION_STATE_STORAGE_KEY = 'regions-state';

let _log:logger.Logger = logger.create('RegionManager');

export default class RegionManager {
  _regionsByName:{ [regionName: string] : RegionModel };
  _persistRegionConfiguration:Boolean;
  constructor(regions:Array<RegionModel>, persistRegionConfiguration) {
    this._regionsByName = {};
    this._persistRegionConfiguration = persistRegionConfiguration;
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
    },
    persistToLocalStorage
  ) {
    const region : RegionModel = this._regionsByName[regionName];
    Guard.isDefined(region, `region with name ${regionName} not registered`);
    region.addToRegion(model, options);

    if (this._persistRegionConfiguration && persistToLocalStorage) {
      this._saveState(regionName, model.modelId);
    }
  }

  removeFromRegion(regionName:string, model:ModelBase, displayContext:?string) {
    const region : RegionModel = this._regionsByName[regionName];
    Guard.isDefined(region, `region with name ${regionName} not registered`);
    region.removeFromRegion(model, displayContext);
  }


  _saveState(regionName, modelId) {
    let lookup = JSON.parse(window.localStorage.getItem(REGION_STATE_STORAGE_KEY)) || {};
    lookup[modelId] = {
      regionName
    };
    const state = JSON.stringify(lookup);
    _log.info(`Save region state: ${state}`);
    window.localStorage.setItem(REGION_STATE_STORAGE_KEY, state);
  }

  shouldPopoutFromRegion(regionName, modelId) {
    let lookup = JSON.parse(window.localStorage.getItem(REGION_STATE_STORAGE_KEY)) || {};
    const region = lookup[modelId] || {};
    return typeof region.regionName !== 'undefined' && region.regionName !== regionName;
  }
}
