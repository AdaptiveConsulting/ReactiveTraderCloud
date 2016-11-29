import Rx from 'rx';
import { OpenFin } from '../system/openFin';
import { ExecuteTradeRequest, ExecuteTradeResponse } from './model';
import { TradeMapper } from './mappers';
import { logger, SchedulerService } from '../system';
import { Connection, ServiceBase } from '../system/service';
import { ReferenceDataService } from './';

const _log:logger.Logger = logger.create('ExecutionService');

export default class ExecutionService extends ServiceBase {

  static EXECUTION_CLIENT_TIMEOUT_MS  =  2000;
  static EXECUTION_REQUEST_TIMEOUT_MS = 30000;

  constructor(serviceType:string,
              connection:Connection,
              schedulerService:SchedulerService,
              referenceDataService:ReferenceDataService,
              openFin:OpenFin) {
    super(serviceType, connection, schedulerService);
    this._openFin = openFin;
    this._tradeMapper = new TradeMapper(referenceDataService);
  }

  executeTrade(executeTradeRequest:ExecuteTradeRequest):Rx.Observable<ExecuteTradeResponse> {
    let _this = this;
    return Rx.Observable.create(
      o => {
        _log.info(`executing: ${executeTradeRequest.toString()}`, executeTradeRequest);
        let disposables = new Rx.CompositeDisposable();

        disposables.add(
          _this._openFin
            .checkLimit(executeTradeRequest.SpotRate, executeTradeRequest.Notional, executeTradeRequest.CurrencyPair)
            .timeout(ExecutionService.EXECUTION_REQUEST_TIMEOUT_MS, Rx.Observable.throw(new Error('Timeout')))
            .take(1)
            .subscribe(limitCheckResult => {
              if (limitCheckResult) {
                let request = _this._serviceClient
                  .createRequestResponseOperation('executeTrade', executeTradeRequest)
                  .publish()
                  .refCount();
                disposables.add(
                  Rx.Observable.merge(
                    request
                      .map(dto => {
                        const trade = _this._tradeMapper.mapFromTradeDto(dto.Trade);
                        _log.info(`execute response received for: ${executeTradeRequest.toString()}. Status: ${trade.status}`, dto);
                        return ExecuteTradeResponse.create(trade);
                      })
                      // if we never receive a response, mark request as complete
                      .timeout(ExecutionService.EXECUTION_REQUEST_TIMEOUT_MS, Rx.Observable.return(ExecuteTradeResponse.createForError('Trade execution timeout exceeded'))),
                    // show timeout error if request is taking longer than expected
                    Rx.Observable.timer(ExecutionService.EXECUTION_CLIENT_TIMEOUT_MS)
                      .map(() => ExecuteTradeResponse.createForError('Trade execution timeout exceeded'))
                      .takeUntil(request))
                    .subscribe(o)
                );
              }
              else {
                o.onNext(ExecuteTradeResponse.createForError('Credit limit exceeded'));
              }
            }, () => o.onNext(ExecuteTradeResponse.createForError('Credit limit check failed')))
        );
        return disposables;
      }
    );
  }
}
