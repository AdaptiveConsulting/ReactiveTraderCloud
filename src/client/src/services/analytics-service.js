import system from 'system';
import rx from 'rx';
import * as model from './model';

var _log:system.logger.Logger = system.logger.create('AnalyticsService');

export default class AnalyticsService extends system.service.ServiceBase {

  getAnalyticsStream(analyticsRequest:model.AnalyticsRequest) {
    system.Guard.isDefined(analyticsRequest, 'analyticsRequest required');
    let _this = this;
    return Rx.Observable.create(
      o => {
        _log.info('Subscribing to trade stream');
        return _this._serviceClient
          .createStreamOperation('getAnalytics', analyticsRequest)
          .retryWithPolicy(system.RetryPolicy.backoffTo10SecondsMax, 'getAnalytics', _this._schedulerService.async)
          .select(data => data) // TODO mappers
          .subscribe(o);
      }
    );
  }
}
