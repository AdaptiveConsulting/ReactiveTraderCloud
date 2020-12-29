import { bind } from "@react-rxjs/core"
import { collectValues, mergeWithKey, split } from "@react-rxjs/utils"
import { Subject } from "rxjs"
import { map, scan, share } from "rxjs/operators"
import { getRemoteProcedureCall$ } from "./client"
import { Direction } from "./trades"

interface TradeRaw {
  CurrencyPair: string
  DealtCurrency: string
  Direction: Direction
  Notional: number
  SpotRate: number
  Status: ExecutionStatus
  TradeDate: string
  TradeId: number
  TraderName: string
  ValueDate: string
}

// This is what is returned from the server
interface ExecutionResponse {
  Trade: TradeRaw;
}

interface ExecutionPayload {
  CurrencyPair: string;
  DealtCurrency: string;
  Direction: Direction;
  Notional: number;
  SpotRate: number;
  id: string;
}

export enum ExecutionStatus {
  None = "None",
  Pending = "Pending",
  Done = "Done",
  Rejected = "Rejected"
}

interface NewExecution {
  currencyPair: string;
  dealtCurrency: string;
  direction: Direction;
  notional: number;
  spotRate: number;
}

export interface Execution {
  currencyPair: string;
  dealtCurrency: string;
  direction: Direction;
  id: string;
  notional: number;
  spotRate: number;
  status: ExecutionStatus;
  tradeId: number;
  valueDate: string;
}

interface MinimumExecution {
  currencyPair: string;
  id: string;
}

// TODO
const generateId = () => Math.random().toString()

const newExecution$ = new Subject<NewExecution>()
export const onNewExecution = (i: NewExecution) => newExecution$.next(i)

const executionResponse$ = new Subject<Execution>()
const onExecutionResponse = (i: Execution) => executionResponse$.next(i)

const executionAcknowledge$ = new Subject<MinimumExecution>()
export const onExecutionAcknowledge = (i: MinimumExecution) => executionAcknowledge$.next(i)

const executionActions$ = mergeWithKey({
  create: newExecution$.pipe(map(e => ({
    ...e,
    id: generateId(),
    status: ExecutionStatus.Pending,
    tradeId: 0,
    valueDate: ''
  }))),
  response: executionResponse$,
  acknowledge: executionAcknowledge$
})

const blankExecution = (sym: string = ''): Execution => {
  return {
    currencyPair: sym,
    dealtCurrency: '',
    direction: Direction.Buy,
    notional: 0,
    spotRate: 0,
    id: '',
    status: ExecutionStatus.None,
    tradeId: 0,
    valueDate: ''
  }
}

const executionsMap$ = executionActions$.pipe(
  split(
    event => event.payload.currencyPair,
    event$ =>
      event$.pipe(
        scan(
          (state, action) => {
            switch (action.type) {
              case 'create':
                const newExecution = { ...action.payload }
                requestExecution(newExecution)
                return newExecution
              case 'response':
                return { ...action.payload }
              case 'acknowledge':
                if (state.id === action.payload.id) {
                  return { ...state, id: '0', status: ExecutionStatus.None }
                }

                return state
            }
          },
          blankExecution()
        )
      )
  ),
  collectValues()
)

export const executionsList$ = executionsMap$.pipe(
  map((executionsMap) => [...executionsMap.values()]),
  share()
)

export const [useExecutions, executions$] = bind(executionsList$)

export const [useExecution, execution$] = bind(
  // startWith was not returning a blank execution
  (currencyPair: string) => executions$.pipe(
    map(executions => executions.filter(e => e.currencyPair === currencyPair)[0] || blankExecution(currencyPair)),
  )
)

const mapExecutiontoPayload = (e: Execution): ExecutionPayload => {
  return {
    CurrencyPair: e.currencyPair,
    DealtCurrency: e.dealtCurrency,
    Direction: e.direction,
    Notional: e.notional,
    SpotRate: e.spotRate,
    id: e.id
  }
}

const mapResponseToExecution = (r: ExecutionResponse, id: string): Execution => {
  const trade = r.Trade
  return {
    currencyPair: trade.CurrencyPair,
    dealtCurrency: trade.DealtCurrency,
    direction: trade.Direction,
    notional: trade.Notional,
    spotRate: trade.SpotRate,
    status: trade.Status,
    tradeId: trade.TradeId,
    valueDate: trade.ValueDate,
    id
  }
}

const requestExecution = (p: Execution) => {
  const payload = mapExecutiontoPayload(p)
  getRemoteProcedureCall$<ExecutionResponse, ExecutionPayload>("execution", "executeTrade", payload)
    .subscribe(response => {
      const mapped = mapResponseToExecution(response, p.id)
      onExecutionResponse(mapped)
      setTimeout(() => onExecutionAcknowledge(mapped), 5000)
    })
}