import _ from 'lodash';
import { ModelBase } from '../../common';
import { Router, observeEvent } from 'esp-js/src';
import { RegionModelRegistration } from './';
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

  @observeEvent('registrationRemoved')
  _onRegistrationRemoved(e:{ model:ModelBase }) {
    this._log.info('Region closed');
    this._removeFromRegion(e.model, true);
  }

  get regionName() {
    return this._regionName;
  }

  addToRegion(model:ModelBase, onExternallyRemovedCallback:?() => void, context:?string) {
    this.ensureOnDispatchLoop(()=> {
      this.modelRegistrations.push(new RegionModelRegistration(
        model,
        onExternallyRemovedCallback,
        context
      ));
    });
  }

  removeFromRegion(model:ModelBase) {
    this.ensureOnDispatchLoop(()=> {
      this._removeFromRegion(model, false);
    });
  }

  _removeFromRegion(model:ModelBase, wasExternallyRemoved:boolean) {
    let removedItems = _.remove(this.modelRegistrations, (regionModelRegistration:RegionModelRegistration) => {
      return regionModelRegistration.model === model;
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
