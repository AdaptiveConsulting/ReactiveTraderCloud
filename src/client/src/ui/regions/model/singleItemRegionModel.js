import { Router, RouterSubject, observeEvent } from 'esp-js';
import { RegionModel, RegionOptions, RegionModelRegistration } from './';
import { ModelBase } from '../../common';

export default class SingleItemRegionModel extends RegionModel {
  _contentStatusSubject:RouterSubject;

  showContent:boolean;

  constructor(modelId:string, regionName:string, router:Router) {
    super(modelId, regionName, router);
    this._contentStatusSubject = router.createSubject();
    this.isCollapsed = false;
  }

  get contentStatus() {
    return this._contentStatusSubject.asRouterObservable();
  }

  get hasContent() {
    return this.modelRegistrations.length === 1;
  }

  @observeEvent('toggleIsCollapsed')
  _onToggleIsCollapsed() {
    this.isCollapsed = !this.isCollapsed;
  }

  // override
  _addToRegion(model:ModelBase, options?:RegionOptions) : RegionModelRegistration {
    if (this.modelRegistrations.length === 1) {
      let regionModelRegistration : RegionModelRegistration = this.modelRegistrations[0];
      this._removeFromRegion(regionModelRegistration.model, true);
    }
    this.modelRegistrations.length = 0;
    this.isCollapsed = false;
    let registration = super._addToRegion(model, options);
    return registration;
  }

  // override
  _removeFromRegion(model:ModelBase, wasExternallyRemoved:boolean, displayContext?:string) {
    this.isCollapsed = true;
    return super._removeFromRegion(model, wasExternallyRemoved, displayContext);
  }
}
