import { delay, of, Subject, switchMap } from 'rxjs'
import {
  ExecuteTradeRequest,
  ExecutionResponse,
  ExecutionService
} from '../generated/TradingGateway'

// const mapExecutionToPayload = (e: any): ExecuteTradeRequest => {
//   return {
//     currencyPair: e.currencyPair,
//     spotRate: e.spotRate,
//     direction: e.direction,
//     notional: e.notional,
//     dealtCurrency: e.dealtCurrency,
//     valueDate: new Date().toISOString().substr(0, 10) // TODO: talk with hydra team about this
//   }
// }

export const executing$ = new Subject<ExecuteTradeRequest>()
export const executionResponse$ = new Subject<ExecutionResponse>()

export const execute = async (execution: ExecuteTradeRequest) => {
  executing$.next(execution)
  return of(null)
    .pipe(
      delay(2000),
      switchMap(() => ExecutionService.executeTrade(execution))
    )
    .toPromise()
    .then(response => executionResponse$.next(response!))
}
