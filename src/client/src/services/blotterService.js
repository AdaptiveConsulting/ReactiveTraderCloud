import Rx from 'rx';
import { TradeMapper } from './mappers';
import { ServiceBase } from '../system/service';
import { logger, RetryPolicy } from '../system';

var _log = logger.create('BlotterService');

export default class BlotterService extends ServiceBase {

  constructor(serviceType,
              connection,
              schedulerService,
              referenceDataService) {
    super(serviceType, connection, schedulerService);
    this._tradeMapper = new TradeMapper(referenceDataService);
  }

  getTradesStream() {
    let _this = this;
    return Rx.Observable.create(
      o => {
        _log.debug('Subscribing to trade stream');
        return _this._serviceClient
          .createStreamOperation('getTradesStream', {/* noop request */ })
          .retryWithPolicy(RetryPolicy.backoffTo10SecondsMax, 'getTradesStream', _this._schedulerService.async)
          .map(dto => _this._tradeMapper.mapFromDto(dto))
          .subscribe(o);
      }
    );
  }
}
