import { Observable, Subscription, Scheduler } from 'rxjs/Rx';
import ExecuteTradeResponse from './model/executeTradeResponse';
import { TradeMapper } from './mappers';
import { logger, SchedulerService } from '../system';
import { ServiceBase } from '../system/service';

const _log = logger.create('ExecutionService');

export default class ExecutionService extends ServiceBase {

  static EXECUTION_CLIENT_TIMEOUT_MS  =  2000;
  static EXECUTION_REQUEST_TIMEOUT_MS = 30000;

  constructor(serviceType,
              connection,
              schedulerService,
              referenceDataService,
              openFin) {
    super(serviceType, connection, schedulerService);
    this._openFin = openFin;
    this._tradeMapper = new TradeMapper(referenceDataService);
  }

  executeTrade(executeTradeRequest) {
    let _this = this;
    return Observable.create(
      o => {
        _log.info('executing: ', executeTradeRequest);
        let disposables = new Subscription();

        disposables.add(
          _this._openFin
            .checkLimit(executeTradeRequest.SpotRate, executeTradeRequest.Notional, executeTradeRequest.CurrencyPair)
            .take(1)
            .subscribe(limitCheckResult => {
              if (limitCheckResult) {
                let request = _this._serviceClient
                  .createRequestResponseOperation('executeTrade', executeTradeRequest)
                  .publish()
                  .refCount();
                disposables.add(
                  Observable.merge(
                    request
                      .map(dto => {
                        const trade = _this._tradeMapper.mapFromTradeDto(dto.Trade);
                        _log.info(`execute response received for: ${executeTradeRequest}. Status: ${trade.status}`, dto);
                        return ExecuteTradeResponse.create(trade);
                      })
                      // if we never receive a response, mark request as complete
                      .timeout(ExecutionService.EXECUTION_REQUEST_TIMEOUT_MS, Scheduler.asap.schedule(() => ExecuteTradeResponse.createForError('Trade execution timeout exceeded'))),
                    // show timeout error if request is taking longer than expected
                    Observable.timer(ExecutionService.EXECUTION_CLIENT_TIMEOUT_MS)
                      .map(() => ExecuteTradeResponse.createForError('Trade execution timeout exceeded'))
                      .takeUntil(request))
                    .subscribe(o)
                );
              }
              else {
                o.next(ExecuteTradeResponse.createForError('Credit limit exceeded'));
              }
            })
        );
        return disposables;
      }
    );
  }
}
