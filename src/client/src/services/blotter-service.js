import system from 'system';
import Rx from 'rx';

var _log:system.logger.Logger = system.logger.create('BlotterService');

export default class BlotterService extends system.service.ServiceBase {

  getTradesStream() {
    let _this = this;
    return Rx.Observable.create(
      o => {
        _log.info('Subscribing to trade stream');
        return _this._serviceClient
          .createStreamOperation('getTradesStream', {/* noop request */ })
          .retryWithPolicy(system.RetryPolicy.backoffTo10SecondsMax, 'getTradesStream', _this._schedulerService.async)
          .select(data => data) // TODO mappers
          .subscribe(o);
      }
    );
  }
}
