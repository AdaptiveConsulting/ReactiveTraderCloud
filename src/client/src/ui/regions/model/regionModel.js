import _ from 'lodash';
import { ModelBase } from '../../common';
import { Router, observeEvent } from 'esp-js/src';
import { RegionModelRegistration, RegionOptions } from './';
import { logger } from '../../../system';

export default class RegionModel extends ModelBase {
  _regionName:string;
  _log:logger.Logger;

  modelRegistrations:Array<RegionModelRegistration>

  constructor(modelId:string, regionName:string, router:Router) {
    super(modelId, router);
    this._regionName = regionName;
    this._log = logger.create(`Region-${this._regionName}`);
    this.modelRegistrations = [];
  }

  @observeEvent('init')
  _onInit() {
    this._log.info('Region initialised');
  }

  @observeEvent('removeFromRegion')
  _onRemoveFromRegion(e:{ model:ModelBase }) {
    this._log.info('Item removed from region');
    this._removeFromRegion(e.model, true);
  }

  get regionName() {
    return this._regionName;
  }

  addToRegion(model:ModelBase, options?: RegionOptions) {
    this.ensureOnDispatchLoop(()=> {
      this._addToRegion(model, options);
    });
  }

  removeFromRegion(model:ModelBase, displayContext?:string) {
    this.ensureOnDispatchLoop(()=> {
      this._removeFromRegion(model, false, displayContext);
    });
  }

  _addToRegion(model:ModelBase, options?:RegionOptions) : RegionModelRegistration{
    options = options || { };
    var regionModelRegistration = new RegionModelRegistration(
      model,
      options.onExternallyRemovedCallback,
      options.displayContext,
      options.regionSettings
    );
    this.modelRegistrations.push(regionModelRegistration);
    return regionModelRegistration;
  }

  _removeFromRegion(model:ModelBase, wasExternallyRemoved:boolean, displayContext?:string) {
    let removedItems = _.remove(this.modelRegistrations, (regionModelRegistration:RegionModelRegistration) => {
      return regionModelRegistration.model === model && regionModelRegistration.displayContext === displayContext;
    });
    _.forEach(removedItems, regionModelRegistration=> {
      if(wasExternallyRemoved) {
        if (regionModelRegistration.onExternallyRemovedCallback) {
          regionModelRegistration.onExternallyRemovedCallback();
        }
      }
    });
  }
}
