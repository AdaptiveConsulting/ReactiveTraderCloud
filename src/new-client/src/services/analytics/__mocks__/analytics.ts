import { defer, of, Observable } from "rxjs"
import { HistoryEntry } from "../types"

let historyMocks$: Observable<HistoryEntry[]> = of([])

export const __setHistoryMock = (value: Observable<HistoryEntry[]>) => {
  historyMocks$ = value
}

export const __resetHistoryMocks = () => {
  historyMocks$ = of([])
}

export const history$ = defer(() => historyMocks$)

export const __resetMocks = () => {
  __resetHistoryMocks()
}
