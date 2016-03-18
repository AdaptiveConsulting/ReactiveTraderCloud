import { ModelBase } from '../../common';

let key = 1;
export default class RegionModelRegistration {
  _model:ModelBase;
  _context:string;
  _onExternallyRemovedCallback:() => void;

  constructor(model:ModelBase, onExternallyRemovedCallback:?() => void, context:?string) {
    this._model = model;
    this._context = context;
    this._onExternallyRemovedCallback = onExternallyRemovedCallback;
    this._key = `regionModelRegistration-${key++}`;
  }

  get key() {
    return this._key;
  }

  get model():ModelBase {
    return this._model;
  }

  get context():string {
    return this._context;
  }

  get onExternallyRemovedCallback():() => void {
    return this._onExternallyRemovedCallback;
  }
}
