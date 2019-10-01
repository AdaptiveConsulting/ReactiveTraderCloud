import { ServiceClient } from 'rt-system'
import { mapFromTradeDto, TradeRaw } from 'rt-types'
import { merge, Observable, of, timer } from 'rxjs'
import { map, mapTo, mergeMap, take, takeUntil, tap, publish } from 'rxjs/operators'
import {
  createExecuteTradeResponse,
  createExecuteTradeResponseForError,
  ExecuteTradeRequest,
} from '../model/executeTradeRequest'
import numeral from 'numeral'

interface RawTradeReponse {
  Trade: TradeRaw
}

const LOG_NAME = 'Execution Service:'

const EXECUTION_CLIENT_TIMEOUT_MS = 2000
const EXECUTION_REQUEST_TIMEOUT_MS = 30000

export default class ExecutionService {
  constructor(
    private readonly serviceClient: ServiceClient,
    private readonly limitChecker: (
      executeTradeRequest: ExecuteTradeRequest,
    ) => Observable<boolean>,
  ) {}

  formatTradeRequest(rawTradeRequest: ExecuteTradeRequest) {
    const SpotRate = +numeral(rawTradeRequest.SpotRate).format('0,000[.]00000')
    return { ...rawTradeRequest, SpotRate }
  }

  executeTrade(rawExecuteTradeRequest: ExecuteTradeRequest) {
    const executeTradeRequest = this.formatTradeRequest(rawExecuteTradeRequest)

    return this.limitChecker(executeTradeRequest).pipe(
      tap(() => console.info(LOG_NAME, 'executing: ', executeTradeRequest)),
      take(1),
      mergeMap(tradeWithinLimit => {
        if (!tradeWithinLimit) {
          return of(
            createExecuteTradeResponseForError('Credit limit exceeded', executeTradeRequest),
          )
        }
        return this.serviceClient
          .createRequestResponseOperation<RawTradeReponse, ExecuteTradeRequest>(
            'execution',
            'executeTrade',
            executeTradeRequest,
          )
          .pipe(
            tap(dto =>
              console.info(
                LOG_NAME,
                `execute response received for ${executeTradeRequest.CurrencyPair}. Status: ${dto.Trade.Status}`,
                {
                  Request: executeTradeRequest,
                  Response: dto,
                },
              ),
            ),
            map(dto => mapFromTradeDto(dto.Trade)),
            map(trade => createExecuteTradeResponse(trade, executeTradeRequest)),
            takeUntil(timer(EXECUTION_REQUEST_TIMEOUT_MS)),
            publish(request =>
              merge(
                request,

                // When the execution has taken a few seconds but we cannot assume its not going to go through
                timer(EXECUTION_CLIENT_TIMEOUT_MS).pipe(
                  mapTo(
                    createExecuteTradeResponseForError(
                      'Trade Execution taking longer then Expected',
                      executeTradeRequest,
                    ),
                  ),
                  takeUntil(request),
                ),

                // After a longer period of time we know a trade is not coming back
                timer(EXECUTION_REQUEST_TIMEOUT_MS).pipe(
                  mapTo(
                    createExecuteTradeResponseForError(
                      'Trade execution timeout exceeded',
                      executeTradeRequest,
                    ),
                  ),
                  takeUntil(request),
                ),
              ),
            ),
          )
      }),
    )
  }
}
