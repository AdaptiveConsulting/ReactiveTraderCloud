import { bind } from "@react-rxjs/core"
import { collect, split } from "@react-rxjs/utils"
import { concat, race, Subject, timer, OperatorFunction } from "rxjs"
import {
  exhaustMap,
  filter,
  map,
  mapTo,
  startWith,
  take,
  takeWhile,
  publish,
} from "rxjs/operators"
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
  Trade: TradeRaw
}

interface ExecutionPayload {
  CurrencyPair: string
  DealtCurrency: string
  Direction: Direction
  Notional: number
  SpotRate: number
  id: string
}

export enum ExecutionStatus {
  Ready = "Ready",
  Pending = "Pending",
  Done = "Done",
  TakingTooLong = "TakingTooLong",
  RequestTimeout = "RequestTimeout",
  Rejected = "Rejected",
}

interface NewExecution {
  currencyPair: string
  dealtCurrency: string
  direction: Direction
  notional: number
  spotRate: number
}

export interface Execution {
  currencyPair: string
  dealtCurrency: string
  direction: Direction
  id: string
  notional: number
  spotRate: number
  status: ExecutionStatus
  tradeId: number
  valueDate: string
}

interface MinimalExecution {
  currencyPair: string
  id: string
}

const mapExecutiontoPayload = (e: Execution): ExecutionPayload => {
  return {
    CurrencyPair: e.currencyPair,
    DealtCurrency: e.dealtCurrency,
    Direction: e.direction,
    Notional: e.notional,
    SpotRate: e.spotRate,
    id: e.id,
  }
}

const mapResponseToExecution = (
  { Trade }: ExecutionResponse,
  id: string,
): Execution => {
  return {
    currencyPair: Trade.CurrencyPair,
    dealtCurrency: Trade.DealtCurrency,
    direction: Trade.Direction,
    notional: Trade.Notional,
    spotRate: Trade.SpotRate,
    status: Trade.Status,
    tradeId: Trade.TradeId,
    valueDate: Trade.ValueDate,
    id,
  }
}

const blankExecution = (currencyPair: string = ""): Execution => {
  return {
    currencyPair,
    dealtCurrency: "",
    direction: Direction.Buy,
    notional: 0,
    spotRate: 0,
    id: "0",
    status: ExecutionStatus.Ready,
    tradeId: 0,
    valueDate: "",
  }
}

// TODO
const generateId = () => Math.random().toString()

const exeuctionFromNew = (newExecution: NewExecution): Execution => {
  return {
    ...newExecution,
    id: generateId(),
    status: ExecutionStatus.Ready,
    tradeId: 0,
    valueDate: "",
  }
}

const REQEUST = 30000
const TAKING_TOO_LONG = 2000

const newExecution$ = new Subject<Execution>()
export const onNewExecution = (i: NewExecution) =>
  newExecution$.next(exeuctionFromNew(i))

const execute = (execution: Execution) => {
  const payload = mapExecutiontoPayload(execution)
  return race([
    getRemoteProcedureCall$<ExecutionResponse, ExecutionPayload>(
      "execution",
      "executeTrade",
      payload,
    ).pipe(map((response) => mapResponseToExecution(response, execution.id))),
    timer(REQEUST).pipe(
      mapTo({ ...execution, status: ExecutionStatus.RequestTimeout }),
    ),
  ])
}

const emitTooLongMessage = <M, T>(
  ms: number,
  message: M,
): OperatorFunction<T, M | T> =>
  publish((multicasted$) =>
    race([multicasted$, concat(timer(ms).pipe(mapTo(message)), multicasted$)]),
  )

const executionDismiss$ = new Subject<MinimalExecution>()
export const onExecutionDismiss = (i: MinimalExecution) =>
  executionDismiss$.next(i)

const DISMISS_TIMEOUT = 5000

const executionsMap$ = newExecution$.pipe(
  split(
    (newExecution) => newExecution.currencyPair,
    (newExecution$, currencyPair) =>
      newExecution$.pipe(
        exhaustMap((execution) => {
          return concat(
            execute(execution).pipe(
              emitTooLongMessage(TAKING_TOO_LONG, {
                ...execution,
                status: ExecutionStatus.TakingTooLong,
              }),
              startWith({ ...execution, status: ExecutionStatus.Pending }),
            ),
            race([
              executionDismiss$.pipe(
                filter((x) => x.currencyPair === currencyPair),
                take(1),
              ),
              timer(DISMISS_TIMEOUT),
            ]).pipe(mapTo(blankExecution(currencyPair))),
          )
        }),
        takeWhile((x) => x.status !== ExecutionStatus.Ready, true),
      ),
  ),
  collect(),
)

export const [useExecution, execution$] = bind((currencyPair: string) =>
  executionsMap$.pipe(
    exhaustMap((executionsMap) =>
      executionsMap.has(currencyPair)
        ? executionsMap.get(currencyPair)!
        : [blankExecution(currencyPair)],
    ),
  ),
)
