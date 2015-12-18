import system from 'system';
import rx from 'rx';
import * as model from './model';

var _log:system.logger.Logger = system.logger.create('BlotterService');

export default class BlotterService {
  _pricingServiceClient:system.service.ServiceClient;

  constructor(serviceClient:system.service.ServiceClient, schedulerService:SchedulerService) {
    this._serviceClient = serviceClient;
    this._schedulerService = schedulerService;
  }

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
