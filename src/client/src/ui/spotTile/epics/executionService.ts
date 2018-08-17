import { logger, ServiceClient } from 'rt-system'
import { mapFromTradeDto, TradeRaw } from 'rt-types'
import { merge, Observable, of, timer } from 'rxjs'
import { map, mapTo, mergeMap, take, takeUntil, tap } from 'rxjs/operators'
import {
  createExecuteTradeResponse,
  createExecuteTradeResponseForError,
  ExecuteTradeRequest
} from '../model/executeTradeRequest'
interface RawTradeReponse {
  Trade: TradeRaw
}

const log = logger.create('ExecutionService')

const EXECUTION_CLIENT_TIMEOUT_MS = 2000
const EXECUTION_REQUEST_TIMEOUT_MS = 30000

export default class ExecutionService {
  constructor(
    private readonly serviceClient: ServiceClient,
    private readonly limitChecker: (executeTradeRequest: ExecuteTradeRequest) => Observable<boolean>
  ) {}

  executeTrade(executeTradeRequest: ExecuteTradeRequest) {
    return this.limitChecker(executeTradeRequest).pipe(
      tap(() => log.info('executing: ', executeTradeRequest)),
      take(1),
      mergeMap(tradeWithinLimit => {
        if (!tradeWithinLimit) {
          return of(createExecuteTradeResponseForError('Credit limit exceeded', executeTradeRequest))
        }
        const request = this.serviceClient
          .createRequestResponseOperation<RawTradeReponse, ExecuteTradeRequest>(
            'execution',
            'executeTrade',
            executeTradeRequest
          )
          .pipe(
            tap(dto =>
              log.info(`execute response received for: ${executeTradeRequest}. Status: ${dto.Trade.Status}`, dto)
            ),
            map(dto => mapFromTradeDto(dto.Trade)),
            map(trade => createExecuteTradeResponse(trade, executeTradeRequest)),
            takeUntil(timer(EXECUTION_REQUEST_TIMEOUT_MS))
          )

        // When the execution has taken a few seconds but we cannot assume its not going to go through
        const firstTimeout = timer(EXECUTION_CLIENT_TIMEOUT_MS).pipe(
          mapTo(createExecuteTradeResponseForError('Trade Execution taking longer then Expected', executeTradeRequest)),
          takeUntil(request)
        )

        // After a longer period of time we know a trade is not coming back
        const lastTimeout = timer(EXECUTION_REQUEST_TIMEOUT_MS).pipe(
          mapTo(createExecuteTradeResponseForError('Trade execution timeout exceeded', executeTradeRequest)),
          takeUntil(request)
        )

        return merge(request, firstTimeout, lastTimeout)
      })
    )
  }
}
