import system from 'system';
import Rx from 'rx';
import { OpenFin } from '../system/openFin';
import { Trade, ExecuteTradeRequest } from './model';
import { TradeMapper } from './mappers';

const _log:system.logger.Logger = system.logger.create('ExecutionService');

export default class ExecutionService extends system.service.ServiceBase {

  constructor(serviceType:String,
              connection:Connection,
              schedulerService:SchedulerService,
              openFin:OpenFin) {
    super(serviceType, connection, schedulerService);
    this._openFin = openFin;
    this._tradeMapper = new TradeMapper();
  }

  executeTrade(executeTradeRequest:ExecuteTradeRequest):Rx.Observable<Trade> {
    let _this = this;
    return Rx.Observable.create(
      o => {
        _log.info(`executing: ${executeTradeRequest.toString()}`, executeTradeRequest);
        let disposables = new Rx.CompositeDisposable();
        disposables.add(
          _this._openFin
            .checkLimit(executeTradeRequest.spotRate, executeTradeRequest.notional, executeTradeRequest.currencyPair)
            .take(1)
            .subscribe(limitCheckResult => {
              if (limitCheckResult) {
                disposables.add(
                  _this._serviceClient
                    .createRequestResponseOperation('executeTrade', executeTradeRequest)
                    .map(dto => {
                      var trade = _this._tradeMapper.mapFromDto(dto.Trade);
                      _log.info(`execute response received for: ${executeTradeRequest.toString()}. Status: ${trade.status}`, dto);
                      return trade;
                    })
                    .subscribe(o)
                );
              }
              else {
                //TODO
                o.onError(new Error('open fin integration not finished'));
              }
            })
        );
        return disposables;
      }
    );
  }
}
