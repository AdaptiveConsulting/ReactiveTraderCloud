import system from 'system';
import rx from 'rx';
import * as model from './model';
import fakeUserRepository from './fake-user-repository';

const _log:system.logger.Logger = system.logger.create('ExecutionService');

export default class ExecutionService extends system.service.ServiceBase  {

  executeTrade(executeTradeRequest:model.ExecuteTradeRequest) {
    return Rx.Observable.create(
      o => {
        _log.info('Subscribing to trade stream');
        const waitForSuitableService = false;

        return this._serviceClient
          .createRequestResponseOperation('executeTrade', executeTradeRequest, waitForSuitableService)
          .select(data => data) // TODO mappers
          .subscribe(o);
      }
    );
  }
}
