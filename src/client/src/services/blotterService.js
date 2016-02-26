import system from 'system';
import Rx from 'rx';
import { Trade } from './model';

var _log:system.logger.Logger = system.logger.create('BlotterService');

export default class BlotterService extends system.service.ServiceBase {

  getTradesStream() : Rx.Observable<Trade> {
    let _this = this;
    return Rx.Observable.create(
      o => {
        _log.info('Subscribing to trade stream');
        return _this._serviceClient
          .createStreamOperation('getTradesStream', {/* noop request */ })
          .retryWithPolicy(system.RetryPolicy.backoffTo10SecondsMax, 'getTradesStream', _this._schedulerService.async)
          .select(dto => this._mapFromDto(dto))
          .subscribe(o);
      }
    );
  }

  _mapFromDto(dto:Object) : Trade {
    return new Trade(
      dto.TradeId,
      dto.TraderName,
      dto.CurrencyPair,
      dto.Notional,
      dto.DealtCurrency,
      dto.Direction,
      dto.SpotRate,
      dto.TradeDate,
      dto.ValueDate,
      dto.Status
    );
  }
}
