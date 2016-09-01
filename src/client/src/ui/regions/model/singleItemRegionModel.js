import { Router, RouterSubject, observeEvent } from 'esp-js';
import { RegionModel, RegionOptions, RegionModelRegistration } from './';
import { ModelBase } from '../../common';

export default class SingleItemRegionModel extends RegionModel {
  _hasContentSubject:RouterSubject;

  showContent:boolean;

  constructor(modelId:string, regionName:string, router:Router) {
    super(modelId, regionName, router);
    this._hasContentSubject = router.createSubject();
    this.showContent = false;
  }

  get hasContentSubject() {
    return this._hasContentSubject.asRouterObservable();
  }

  @observeEvent('toggleShowContent')
  _onToggleShowContent() {
    this.showContent = !this.showContent;
    this._hasContentSubject.onNext(this.showContent);
  }

  // override
  _addToRegion(model:ModelBase, options?:RegionOptions) : RegionModelRegistration {
    if (this.modelRegistrations.length === 1) {
      let regionModelRegistration : RegionModelRegistration = this.modelRegistrations[0];
      this._removeFromRegion(regionModelRegistration.model, true);
    }
    this.modelRegistrations.length = 0;
    this._hasContentSubject.onNext(true);
    this.showContent = true;
    return super._addToRegion(model, options);
  }

  // override
  _removeFromRegion(model:ModelBase, wasExternallyRemoved:boolean, displayContext?:string) {
    this._hasContentSubject.onNext(false);
    this.showContent = false;
    return super._removeFromRegion(model, wasExternallyRemoved, displayContext);
  }
}
