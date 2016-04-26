import { RegionManager, RegionNames } from '../regions';

/**
 * helper class for models that can be popped out into their own window
 */
export default class RegionManagerHelper {
  _regionManager:RegionManager;
  _regionName:string;
  _model:any;

  constructor(
    regionName:string,
    regionManager:RegionManager,
    model:any
  ) {
    this._regionManager = regionManager;
    this._regionName = regionName;
    this._model = model;
  }

  addToRegion() {
    this._regionManager.addToRegion(this._regionName, this._model);
  }

  // TODO remove width and height and let the view figure it out
  popout(title, width:number, height:number) {
    this._regionManager.removeFromRegion(this._regionName, this._model);
    this._regionManager.addToRegion(
      RegionNames.popout,
      this._model,
      {
        onExternallyRemovedCallback: () => {
          // if the popout is closed, we add it back into the initial region
          this._regionManager.addToRegion(this._regionName, this._model);
        },
        regionSettings: {
          width:width,
          height:height,
          title:title
        }
      }
    );
  }
}
