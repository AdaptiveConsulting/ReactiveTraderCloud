import { ModelBase } from '../../common';

export default class RegionModelRegistration {
  _model:ModelBase;
  _context:string;

  constructor(model:ModelBase, context:string) {
    this._model = model;
    this._context = context;
  }

  get model():ModelBase {
    return this._model;
  }

  get context():string {
    return this._context;
  }
}
