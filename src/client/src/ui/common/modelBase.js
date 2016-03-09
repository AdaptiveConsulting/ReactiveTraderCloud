import _ from 'lodash';
import { Router, DisposableBase } from 'esp-js/src';
import { logger, Guard } from '../../system';

var _log:logger.Logger = logger.create('ModelBase');

export default class ModelBase extends DisposableBase {
  _modelId:string;
  router:Router;

  constructor(modelId, router) {
    super();
    Guard.isString(modelId, 'modelId required and must be a string');
    Guard.isDefined(router, 'router required');
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

  get modelId():string {
    return this._modelId;
  }
}
