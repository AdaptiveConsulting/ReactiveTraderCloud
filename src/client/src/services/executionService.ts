import { Observable, Subscription, Scheduler } from 'rxjs/Rx'
import { createExecuteTradeResponse, createExecuteTradeResponseForError } from '../types/executeTradeResponse'
import { TradeMapper } from './mappers'
import { logger } from '../system'
import { ServiceBase } from '../system/service'

const log = logger.create('ExecutionService')

export default class ExecutionService extends ServiceBase {
  static EXECUTION_CLIENT_TIMEOUT_MS  =  2000
  static EXECUTION_REQUEST_TIMEOUT_MS = 30000
  _openFin: any
  _tradeMapper: any
  constructor(serviceType,
              connection,
              schedulerService,
              referenceDataService,
              openFin) {
    super(serviceType, connection, schedulerService)
    this._openFin = openFin
    this._tradeMapper = new TradeMapper(referenceDataService)
  }

  executeTrade(executeTradeRequest) {
    return Observable.create(
      o => {
        log.info('executing: ', executeTradeRequest)
        const disposables = new Subscription()

        disposables.add(
          this._openFin
            .checkLimit(executeTradeRequest.SpotRate, executeTradeRequest.Notional, executeTradeRequest.CurrencyPair)
            .take(1)
            .subscribe(limitCheckResult => {
              if (limitCheckResult) {
                let request = this._serviceClient
                  .createRequestResponseOperation('executeTrade', executeTradeRequest)
                  .publish()
                  .refCount()
                disposables.add(
                  Observable.merge(
                    request
                      .map(dto => {
                        const trade = this._tradeMapper.mapFromTradeDto(dto.Trade)
                        log.info(`execute response received for: ${executeTradeRequest}. Status: ${trade.status}`, dto)
                        return createExecuteTradeResponse(trade)
                      })
                      // if we never receive a response, mark request as complete
                      .timeout(ExecutionService.EXECUTION_REQUEST_TIMEOUT_MS, Scheduler.asap.schedule(() => createExecuteTradeResponseForError('Trade execution timeout exceeded', executeTradeRequest))),
                    // show timeout error if request is taking longer than expected
                    Observable.timer(ExecutionService.EXECUTION_CLIENT_TIMEOUT_MS)
                      .map(() => createExecuteTradeResponseForError('Trade execution timeout exceeded', executeTradeRequest))
                      .takeUntil(request))
                    .subscribe(o)
                )
              }
              else {
                o.next(createExecuteTradeResponseForError('Credit limit exceeded', executeTradeRequest))
              }
            })
        )
        return disposables
      }
    )
  }
}
