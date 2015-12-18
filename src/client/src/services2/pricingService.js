import system from 'system';
import rx from 'rx';
import * as model from './model';

var _log:system.logger.Logger = system.logger.create('PricingService');

export default class PricingService {
  _pricingServiceClient:system.service.ServiceClient;

  constructor(serviceClient:system.service.ServiceClient, schedulerService:SchedulerService) {
    this._serviceClient = serviceClient;
    this._schedulerService = schedulerService;
  }

  getSpotPriceStream(request:model.GetSpotStreamRequest) {
    let _this = this;
    return Rx.Observable.create(
      o => {
        _log.info(`Subscribing to spot price stream for [${request.symbol}]`);
        return _this._serviceClient
          .createStreamOperation('getPriceUpdates', request)
          .retryWithPolicy(system.RetryPolicy.indefiniteEvery2Seconds, 'getPriceUpdates', _this._schedulerService.async)
          .select(price => new model.Price(price)) // mappers?
          .subscribe(o);
      }
    );
  }
}
