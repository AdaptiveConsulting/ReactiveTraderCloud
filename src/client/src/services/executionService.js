import system from 'system';
import rx from 'rx';
import * as model from './model';

var _log:system.logger.Logger = system.logger.create('ExecutionService');

export default class ExecutionService {
  _serviceClient:system.service.ServiceClient;

  constructor(serviceClient:system.service.ServiceClient, schedulerService:SchedulerService) {
    this._serviceClient = serviceClient;
    this._schedulerService = schedulerService;
  }

  executeTrade(executeTradeRequest:model.ExecuteTradeRequest) {
    let _this = this;
    return Rx.Observable.create(
      o => {
        _log.info('Subscribing to trade stream');
        var waitForSuitableService = false;
        return _this._serviceClient
          .createRequestResponseOperation('executeTrade', executeTradeRequest, waitForSuitableService)
          .select(data => data) // TODO mappers
          .subscribe(o);
      }
    );
  }
}
