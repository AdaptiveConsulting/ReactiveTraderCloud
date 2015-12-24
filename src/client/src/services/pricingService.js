import system from 'system';
import Rx from 'rx';
import * as model from './model';

var _log:system.logger.Logger = system.logger.create('PricingService');

export default class PricingService extends system.service.ServiceBase {

  getSpotPriceStream(request:model.GetSpotStreamRequest) : Rx.Observable<model.SpotPrice> {
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

  _mapSpotPrice(dto) : model.SpotPrice {
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
