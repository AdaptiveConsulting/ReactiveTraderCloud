import { RegionManager, RegionNames } from '../regions';
const REGION_STATE_STORAGE_KEY = 'regions-state';

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

          setTimeout(() => {
            this._saveState();
          }, 1000);
        },
        regionSettings: {
          width,
          height,
          title
        }
      }
    );
    setTimeout(() => {
      this._saveState();
    }, 1000);

  }

  _saveState() {
    let lookup = {};
    Object.keys(this._regionManager._regionsByName)
      .map(key => this._regionManager._regionsByName[key])
      .reduce((acc, newValue) => {
        return [...acc, ...newValue.modelRegistrations.map(mr => {
          return {
            modelKey: mr.model.modelId,
            regionName: newValue.regionName
          };
        })];
      }, [])
      .forEach(({modelKey, regionName}) => {
        lookup[modelKey] = regionName;
      });
    window.localStorage.setItem(REGION_STATE_STORAGE_KEY, JSON.stringify(lookup));
  }

  shouldPopoutFromRegion(popoutName) {
    let popouts = JSON.parse(window.localStorage.getItem(REGION_STATE_STORAGE_KEY)) || {};
    const region = popouts[popoutName];
    return typeof region !== 'undefined' && region !== this._regionName;
  }
}
