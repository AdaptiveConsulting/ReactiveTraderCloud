import system from 'system';
import rx from 'rx';
import * as model from './model';

var _log:system.logger.Logger = system.logger.create('ReferenceDataService');

export default class ReferenceDataService extends system.service.ServiceBase {

  getCurrencyPairUpdatesStream() {
    let _this = this;
    return Rx.Observable.create(
      o => {
        _log.info('Subscribing reference data stream');
        return _this._serviceClient
          .createStreamOperation('getCurrencyPairUpdatesStream', {/* noop request */ })
          .retryWithPolicy(system.RetryPolicy.backoffTo10SecondsMax, 'getCurrencyPairUpdatesStream', _this._schedulerService.async)
          .select(data => data) // TODO mappers
          .subscribe(o);
      }
    );
  }
}
