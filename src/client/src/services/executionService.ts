import { Observable, of, race, timer } from 'rxjs'
import { map, mapTo, mergeMap, take, tap } from 'rxjs/operators'
import { logger } from '../system'
import { ServiceClient } from '../system/service'
import { TradeSuccessResponse } from '../types'
import {
  createExecuteTradeResponse,
  createExecuteTradeResponseForError,
  ExecuteTradeRequest,
  ServiceConst,
  TradeErrorResponse
} from '../types'
import { mapFromTradeDto } from './mappers'
import { TradeRaw } from './mappers/tradeMapper'

interface RawTradeReponse {
  Trade: TradeRaw
}

const log = logger.create('ExecutionService')

const EXECUTION_CLIENT_TIMEOUT_MS = 2000

export default class ExecutionService {
  constructor(
    private readonly serviceClient: ServiceClient,
    private readonly limitChecker: (
      executeTradeRequest: ExecuteTradeRequest
    ) => Observable<boolean>
  ) {}

  executeTrade(executeTradeRequest: ExecuteTradeRequest) {
    return this.limitChecker(executeTradeRequest).pipe(
      tap(() => log.info('executing: ', executeTradeRequest)),
      take(1),
      mergeMap(limitBreached => {
        if (!limitBreached) {
          return of(
            createExecuteTradeResponseForError(
              'Credit limit exceeded',
              executeTradeRequest
            )
          )
        }
        const request = this.serviceClient
          .createRequestResponseOperation<RawTradeReponse, ExecuteTradeRequest>(
            ServiceConst.ExecutionServiceKey,
            'executeTrade',
            executeTradeRequest
          )
          .pipe(
            tap(dto =>
              log.info(
                `execute response received for: ${executeTradeRequest}. Status: ${
                  dto.Trade.Status
                }`,
                dto
              )
            ),
            map(dto => mapFromTradeDto(dto.Trade)),
            map(trade => createExecuteTradeResponse(trade, executeTradeRequest))
          )

        const timeout = timer(EXECUTION_CLIENT_TIMEOUT_MS).pipe(
          mapTo(
            createExecuteTradeResponseForError(
              'Trade execution timeout exceeded',
              executeTradeRequest
            )
          )
        )

        return race<TradeErrorResponse | TradeSuccessResponse>(request, timeout)
      })
    )
  }
}
