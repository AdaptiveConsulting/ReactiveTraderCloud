import _ from 'lodash';
import { Router, DisposableBase } from 'esp-js/src';
import { logger } from '../../system';

var _log:logger.Logger = logger.create('ModelBase');

export default class ModelBase extends DisposableBase {
  _modelId:String;
  router:Router;

  constructor(modelId, router) {
    super();
    this._modelId = modelId;
    this.router = router;
  }

  observeEvents() {
    _log.debug(`Adding model with id ${this._modelId} to router`);
    this.router.addModel(this._modelId, this);
    this.addDisposable(() => {
      _log.debug(`Removing model with id ${this._modelId} from router`);
      this.router.removeModel(this._modelId);
    });
    this.addDisposable(this.router.observeEventsOn(this._modelId, this));
  }

  get modelId():String {
    return this._modelId;
  }
}
