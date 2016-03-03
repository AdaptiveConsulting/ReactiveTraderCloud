import system from 'system';
import Rx from 'rx';
import { SpotPrice, GetSpotStreamRequest } from './model';
import { PriceMapper } from './mappers';

var _log:system.logger.Logger = system.logger.create('PricingService');

export default class PricingService extends system.service.ServiceBase {

  constructor(serviceType:String, connection:Connection, schedulerService:SchedulerService) {
    super(serviceType, connection, schedulerService);
    this._priceMapper = new PriceMapper();
  }

  getSpotPriceStream(request:GetSpotStreamRequest) : Rx.Observable<SpotPrice> {
    let _this = this;
    const getPriceUpdatesOperationName = 'getPriceUpdates';
    return Rx.Observable.create(
      o => {
        _log.debug(`Subscribing to spot price stream for [${request.symbol}]`);
        return _this._serviceClient
          .createStreamOperation(getPriceUpdatesOperationName, request)
          .retryWithPolicy(system.RetryPolicy.indefiniteEvery2Seconds, getPriceUpdatesOperationName, _this._schedulerService.async)
          .scan((lastPrice, nextPrice) => { return { lastPrice:lastPrice, nextPrice:nextPrice } }, SpotPrice.empty)
          .select(dto => _this._priceMapper.mapFromSpotPriceDto(dto))
          .subscribe(o);
      }
    );
  }
}
