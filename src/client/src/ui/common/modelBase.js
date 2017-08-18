import { logger, Guard } from '../../system';

var _log = logger.create('ModelBase');

export default class ModelBase {
  _modelId;
  router;

  constructor(modelId, router) {
    Guard.isString(modelId, 'modelId required and must be a string');
    Guard.isDefined(router, 'router required');
    this._modelId = modelId;
    this.router = router;
  }

  get modelId() {
    return this._modelId;
  }
}
