import { ModelBase } from '../../common';

let key = 1;
export default class RegionModelRegistration {
  _model;
  _displayContext;
  _onExternallyRemovedCallback;
  _regionSettings;

  constructor(model, onExternallyRemovedCallback, displayContext, regionSettings) {
    this._model = model;
    this._displayContext = displayContext;
    this._onExternallyRemovedCallback = onExternallyRemovedCallback;
    this._regionSettings = regionSettings;
    this._key = `regionModelRegistration-${key++}`;
  }

  get key() {
    return this._key;
  }

  get model() {
    return this._model;
  }

  get displayContext() {
    return this._displayContext;
  }

  get onExternallyRemovedCallback() {
    return this._onExternallyRemovedCallback;
  }

  get regionSettings() {
    return this._regionSettings;
  }
}
