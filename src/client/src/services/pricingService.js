import system from 'system';
import Rx from 'rx';
import { SpotPrice, GetSpotStreamRequest } from './model';

var _log:system.logger.Logger = system.logger.create('PricingService');

export default class PricingService extends system.service.ServiceBase {

  getSpotPriceStream(request:GetSpotStreamRequest) : Rx.Observable<SpotPrice> {
    let _this = this;
    const getPriceUpdatesOperationName = 'getPriceUpdates';
    return Rx.Observable.create(
      o => {
        _log.info(`Subscribing to spot price stream for [${request.symbol}]`);
        return _this._serviceClient
          .createStreamOperation(getPriceUpdatesOperationName, request)
          .retryWithPolicy(system.RetryPolicy.indefiniteEvery2Seconds, getPriceUpdatesOperationName, _this._schedulerService.async)
          .select(dto => _this._mapSpotPrice(dto))
          .subscribe(o);
      }
    );
  }

  _mapSpotPrice(dto:Object) : SpotPrice {
    return new SpotPrice(
      dto.Symbol,
      Number(dto.Bid),
      Number(dto.Ask),
      Number(dto.Mid),
      dto.ValueDate,
      dto.CreationTimestamp
    );
  }
}
