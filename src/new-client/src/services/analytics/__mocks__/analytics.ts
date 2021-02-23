import { bind } from "@react-rxjs/core"
import { defer, of, Observable } from "rxjs"
import { HistoryEntry, CurrencyPairPosition } from "../types"

let historyMocks$: Observable<HistoryEntry[]> = of([])
let positionMocks$: Observable<Record<string, CurrencyPairPosition>> = of({})

export const __setHistoryMock = (value: Observable<HistoryEntry[]>) => {
  historyMocks$ = value
}

export const __resetHistoryMocks = () => {
  historyMocks$ = of([])
}

export const history$ = defer(() => historyMocks$)

export const __setPositionMock = (
  value: Observable<Record<string, CurrencyPairPosition>>,
) => {
  positionMocks$ = value
}

export const __resetPositionMocks = () => {
  positionMocks$ = of({})
}

export const [useCurrentPositions, currentPositions$] = bind(
  defer(() => {
    return positionMocks$
  }),
)

export const __resetMocks = () => {
  __resetHistoryMocks()
  __resetPositionMocks()
}
