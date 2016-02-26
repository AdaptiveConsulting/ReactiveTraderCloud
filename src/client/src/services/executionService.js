import system from 'system';
import Rx from 'rx';
import { OpenFin } from '../system/openFin';
import { Trade, ExecuteTradeRequest } from './model';

const _log:system.logger.Logger = system.logger.create('ExecutionService');

export default class ExecutionService extends system.service.ServiceBase {

  constructor(serviceType:String,
              connection:Connection,
              schedulerService:SchedulerService,
              openFin:OpenFin) {
    super(serviceType, connection, schedulerService);
    this._openFin = openFin;
  }

  executeTrade(executeTradeRequest:ExecuteTradeRequest):Rx.Observable<Trade> {
    let _this = this;
    return Rx.Observable.create(
      o => {
        _log.info('Subscribing to trade stream');
        let disposables = new Rx.CompositeDisposable();
        disposables.add(
          _this._openFin
            .checkLimit(executeTradeRequest.rate, executeTradeRequest.amount, executeTradeRequest.pair)
            .take(1)
            .subscribe(limitCheckResult => {
              if (limitCheckResult) {
                disposables.add(
                  _this._serviceClient
                    .createRequestResponseOperation('executeTrade', executeTradeRequest)
                    .select(dto => _this._mapFromDto(dto)) // TODO mappers
                    .subscribe(o)
                );
              }
              else {
                var trade = Trade.createForFailure(
                  executeTradeRequest.pair,
                  'NotionalOvershot',
                  executeTradeRequest.amount,
                  executeTradeRequest.rate
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

  _mapFromDto(dto:Object) {
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
