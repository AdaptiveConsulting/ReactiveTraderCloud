import Rx from 'rx';
import { Trade } from './model';
import { TradeMapper } from './mappers';
import { Connection, ServiceBase } from '../system/service';
import { OpenFin } from '../system/openFin';
import { logger, SchedulerService, RetryPolicy } from '../system';
import { ReferenceDataService } from './';

var _log:logger.Logger = logger.create('BlotterService');

export default class BlotterService extends ServiceBase {

  constructor(serviceType:string,
              connection:Connection,
              schedulerService:SchedulerService,
              referenceDataService:ReferenceDataService,
              openFin:OpenFin) {
    super(serviceType, connection, schedulerService);
    this._tradeMapper = new TradeMapper(referenceDataService);
    this._openFin = openFin;
  }

  createNotification(trade:Trade){
    if ((trade.status.name === 'Done' || trade.status.name === 'Rejected')){
      this._openFin.openTradeNotification(trade);
    }
  };

  getTradesStream() : Rx.Observable<Array<Trade>> {
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
