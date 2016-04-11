import { ModelBase } from '../../common';

let key = 1;
export default class RegionModelRegistration {
  _model:ModelBase;
  _displayContext:string;
  _onExternallyRemovedCallback:() => void;
  _regionSettings:any;

  constructor(model:ModelBase, onExternallyRemovedCallback:?() => void, displayContext:?string, regionSettings?:any) {
    this._model = model;
    this._displayContext = displayContext;
    this._onExternallyRemovedCallback = onExternallyRemovedCallback;
    this._regionSettings = regionSettings;
    this._key = `regionModelRegistration-${key++}`;
  }

  get key() {
    return this._key;
  }

  get model():ModelBase {
    return this._model;
  }

  get displayContext():string {
    return this._displayContext;
  }

  get onExternallyRemovedCallback():() => void {
    return this._onExternallyRemovedCallback;
  }

  get regionSettings():any {
    return this._regionSettings;
  }
}
