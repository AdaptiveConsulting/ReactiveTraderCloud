import system from 'system';
import Rx from 'rx';
import { Trade } from './model';
import { TradeMapper } from './mappers';

var _log:system.logger.Logger = system.logger.create('BlotterService');

export default class BlotterService extends system.service.ServiceBase {

  constructor(serviceType:String, connection:Connection, schedulerService:SchedulerService) {
    super(serviceType, connection, schedulerService);
    this._tradeMapper = new TradeMapper();
  }

  getTradesStream() : Rx.Observable<Trade> {
    let _this = this;
    return Rx.Observable.create(
      o => {
        _log.debug('Subscribing to trade stream');
        return _this._serviceClient
          .createStreamOperation('getTradesStream', {/* noop request */ })
          .retryWithPolicy(system.RetryPolicy.backoffTo10SecondsMax, 'getTradesStream', _this._schedulerService.async)
          .map(dto => _this._tradeMapper.mapFromDtoArray(dto.Trades))
          .subscribe(o);
      }
    );
  }
}
