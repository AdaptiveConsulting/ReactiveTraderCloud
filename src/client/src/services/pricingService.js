import system from 'system';
import Rx from 'rx';
import * as model from './model';

var _log:system.logger.Logger = system.logger.create('PricingService');

export default class PricingService {
  _serviceClient:system.service.ServiceClient;

  constructor(serviceClient:system.service.ServiceClient, schedulerService:SchedulerService) {
    this._serviceClient = serviceClient;
    this._schedulerService = schedulerService;
  }

  get serviceStatusStream(): Rx.Observable<system.service.ServiceStatus> {
    return this._serviceClient.serviceStatusStream;
  }

  getSpotPriceStream(request:model.GetSpotStreamRequest) : Rx.Observable<model.SpotPrice> {
    let _this = this;
    return Rx.Observable.create(
      o => {
        _log.info(`Subscribing to spot price stream for [${request.symbol}]`);
        return _this._serviceClient
          .createStreamOperation('getPriceUpdates', request)
          .retryWithPolicy(system.RetryPolicy.indefiniteEvery2Seconds, 'getPriceUpdates', _this._schedulerService.async)
          .select(dto => _this._mapSpotPrice(dto))
          .subscribe(o);
      }
    );
  }

  _mapSpotPrice(dto) {
    return new model.SpotPrice(
      dto.Symbol,
      Number(dto.Bid),
      Number(dto.Ask),
      Number(dto.Mid),
      dto.ValueDate,
      dto.CreationTimestamp
    );
  }
}
