import { RegionManager, RegionNames } from '../regions';
import { RegionSettings } from '../../services/model';
/**
 * helper class for models that can be popped out into their own window
 */
export default class RegionManagerHelper {
  _regionManager:RegionManager;
  _regionName:string;
  _model:any;
  _regionSettings:RegionSettings;

  constructor(
    regionName:string,
    regionManager:RegionManager,
    model:any,
    regionSettings:RegionSettings
  ) {
    this._regionManager = regionManager;
    this._regionName = regionName;
    this._model = model;
    this._regionSettings = regionSettings;
  }

  init() {
    this.addToRegion();
    if (this._regionManager.shouldPopoutFromRegion(this._regionName, this._model.modelId)) {
      this.popout();
    }
  }
  addToRegion() {
    this._regionManager.addToRegion(this._regionName, this._model);
  }

  popout() {
    this._regionManager.removeFromRegion(this._regionName, this._model);
    this._regionManager.addToRegion(
      RegionNames.popout,
      this._model,
      {
        onExternallyRemovedCallback: () => {
          // if the popout is closed, we add it back into the initial region
          this._regionManager.addToRegion(this._regionName, this._model, null, true);
        },
        regionSettings: this._regionSettings
      },
      true
    );
  }

}
