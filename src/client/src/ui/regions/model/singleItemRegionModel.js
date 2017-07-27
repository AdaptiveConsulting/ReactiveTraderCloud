import { Router, RouterSubject, observeEvent } from 'esp-js';
import { RegionModel, RegionOptions, RegionModelRegistration } from './';
import { ModelBase } from '../../common';

export default class SingleItemRegionModel extends RegionModel {

  constructor(modelId, regionName, router) {
    super(modelId, regionName, router);
    this.isCollapsed = false;
  }

  get hasContent() {
    return this.modelRegistrations.length === 1;
  }

  @observeEvent('toggleIsCollapsed')
  _onToggleIsCollapsed() {
    this.isCollapsed = !this.isCollapsed;
  }

  // override
  _addToRegion(model, options) {
    if (this.modelRegistrations.length === 1) {
      let regionModelRegistration = this.modelRegistrations[0];
      this._removeFromRegion(regionModelRegistration.model, true);
    }
    this.modelRegistrations.length = 0;
    this.isCollapsed = false;
    let registration = super._addToRegion(model, options);
    return registration;
  }

  // override
  _removeFromRegion(model, wasExternallyRemoved, displayContext) {
    this.isCollapsed = true;
    return super._removeFromRegion(model, wasExternallyRemoved, displayContext);
  }
}
