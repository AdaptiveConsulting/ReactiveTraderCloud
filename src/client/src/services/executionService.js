import system from 'system';
import rx from 'rx';
import * as model from './model';

var _log:system.logger.Logger = system.logger.create('ExecutionService');

export default class ExecutionService extends system.service.ServiceBase  {

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
