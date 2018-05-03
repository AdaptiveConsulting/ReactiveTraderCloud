import { Observable, Scheduler, Subscription } from 'rxjs'
import { merge } from 'rxjs/observable/merge'
import { timer } from 'rxjs/observable/timer'
import {
  map,
  publish,
  refCount,
  take,
  takeUntil,
  timeout
} from 'rxjs/operators'
import { logger } from '../system'
import { ServiceClient } from '../system/service'
import { Connection } from '../system/service/connection'
import {
  createExecuteTradeResponse,
  createExecuteTradeResponseForError,
  ExecuteTradeRequest,
  ExecuteTradeResponse,
  ReferenceDataService,
  ServiceConst
} from '../types'
import { mapFromTradeDto } from './mappers'
import { RawTradeUpdate, TradeRaw } from './mappers/tradeMapper'

interface RawTradeReponse {
  Trade: TradeRaw
}

const log = logger.create('ExecutionService')

const EXECUTION_CLIENT_TIMEOUT_MS = 2000
const EXECUTION_REQUEST_TIMEOUT_MS = 30000

export default function executionService(
  connection: Connection,
  referenceDataService: ReferenceDataService,
  openFin: any
) {
  const serviceClient = new ServiceClient(
    ServiceConst.ExecutionServiceKey,
    connection
  )

  serviceClient.connect()
  return {
    get serviceStatusStream() {
      return serviceClient.serviceStatusStream
    },
    executeTrade(executeTradeRequest: ExecuteTradeRequest) {
      return new Observable<ExecuteTradeResponse>(obs => {
        log.info('executing: ', executeTradeRequest)
        const disposables = new Subscription()

        const localLimitCheck: Subscription = openFin
          .checkLimit(
            executeTradeRequest.SpotRate,
            executeTradeRequest.Notional,
            executeTradeRequest.CurrencyPair
          )
          .pipe(take(1))

          .subscribe((limitCheckResult: boolean) => {
            if (!limitCheckResult) {
              obs.next(
                createExecuteTradeResponseForError(
                  'Credit limit exceeded',
                  executeTradeRequest
                )
              )
            }
            const request = serviceClient
              .createRequestResponseOperation<
                RawTradeReponse,
                ExecuteTradeRequest
              >('executeTrade', executeTradeRequest)
              .pipe(publish<RawTradeReponse>(), refCount())

            disposables.add(
              merge(
                request.pipe(
                  map(dto => {
                    const trade = mapFromTradeDto(dto.Trade)
                    log.info(
                      `execute response received for: ${executeTradeRequest}. Status: ${
                        trade.status
                      }`,
                      dto
                    )
                    return createExecuteTradeResponse(
                      trade,
                      executeTradeRequest
                    )
                  }),
                  // if we never receive a response, mark request as complete
                  timeout(EXECUTION_REQUEST_TIMEOUT_MS, Scheduler.asap.schedule(
                    () =>
                      createExecuteTradeResponseForError(
                        'Trade execution timeout exceeded',
                        executeTradeRequest
                      )
                  ) as any)
                ),

                // show timeout error if request is taking longer than expected
                timer(EXECUTION_CLIENT_TIMEOUT_MS).pipe(
                  map(() =>
                    createExecuteTradeResponseForError(
                      'Trade execution timeout exceeded',
                      executeTradeRequest
                    )
                  ),
                  takeUntil(request)
                )
              ).subscribe(obs)
            )
          })
        disposables.add(localLimitCheck)
        return disposables
      })
    }
  }
}
