import _ from 'lodash';
import {ModelBase} from '../../common';
import {Router, observeEvent} from 'esp-js';
import {RegionModelRegistration, RegionOptions} from './';
import {logger} from '../../../system';

export default class RegionModel extends ModelBase {
  _regionName;
  _log;

  modelRegistrations;

  constructor(modelId, regionName, router) {
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
  _onRemoveFromRegion(e) {
    this._log.info('Item removed from region');
    this._removeFromRegion(e.model, true);
  }

  get regionName() {
    return this._regionName;
  }

  addToRegion(model, options) {
    this.ensureOnDispatchLoop(() => {
      this._addToRegion(model, options);
    });
  }

  removeFromRegion(model, displayContext) {
    this.ensureOnDispatchLoop(() => {
      this._removeFromRegion(model, false, displayContext);
    });
  }

  _addToRegion(model, options) {
    options = options || {};
    let regionModelRegistration = new RegionModelRegistration(
      model,
      options.onExternallyRemovedCallback,
      options.displayContext,
      options.regionSettings
    );
    this.modelRegistrations.push(regionModelRegistration);
    return regionModelRegistration;
  }

  _removeFromRegion(model, wasExternallyRemoved, displayContext) {
    let removedItems = _.remove(this.modelRegistrations, (regionModelRegistration) => {
      return regionModelRegistration.model === model && regionModelRegistration.displayContext === displayContext;
    });
    _.forEach(removedItems, regionModelRegistration => {
      if (wasExternallyRemoved) {
        if (regionModelRegistration.onExternallyRemovedCallback) {
          regionModelRegistration.onExternallyRemovedCallback();
        }
      }
    });
  }
}
