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
        _log.info('Subscribing to trade stream');
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
                    .map(dto => _this._tradeMapper.mapFromDto(dto.Trade))
                    .subscribe(o)
                );
              }
              else {
                var trade = Trade.createForFailure(
                  executeTradeRequest.currencyPair,
                  'NotionalOvershot',
                  executeTradeRequest.notional,
                  executeTradeRequest.spotRate
                );
                o.onNext(trade);
                o.onCompleted();
              }
            })
        );
        return disposables;
      }
    );
  }
}
