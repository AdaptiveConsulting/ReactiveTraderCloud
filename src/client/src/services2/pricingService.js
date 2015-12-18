import system from 'system';
import rx from 'rx';
import * as model from './model';

var _log:system.logger.Logger = system.logger.create('PricingService');

export default class PricingService {
  _pricingServiceClient:system.service.ServiceClient;

  constructor(pricingServiceClient:system.service.ServiceClient, schedulerService:SchedulerService) {
    this._pricingServiceClient = pricingServiceClient;
    this._schedulerService = schedulerService;
  }

  getPriceUpdates(request:model.GetSpotStreamRequest) {
    let _this = this;
    return Rx.Observable.create(
      o => {
        _log.info('Subscribing to price stream for [{0}]', request.symbol);
        return _this._pricingServiceClient
          .createStreamOperation('getPriceUpdates', request, _this._schedulerService.async)
          .retryWithPolicy(system.RetryPolicy.indefiniteEvery2Seconds, 'getPriceUpdates', _this._schedulerService.async)
          .select(price => new model.Price(price)) // mappers?
          .subscribe(o);
      }
    );
  }
}
