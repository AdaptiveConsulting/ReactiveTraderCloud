import { runningPlatform } from 'apps/MainRoute/store/singleServices'
import { InteropTopics } from 'rt-platforms'
import { EMPTY, from, merge, Observable } from 'rxjs'
import { delay, map, mergeMap, scan, share, startWith } from 'rxjs/operators'

type TradeNotification = { tradeNotification: number }

const highlightRequest$ = from(runningPlatform).pipe(
  mergeMap(platform =>
    platform.interop
      ? (platform.interop.subscribe$(InteropTopics.HighlightBlotter) as Observable<
          TradeNotification[]
        >)
      : EMPTY
  ),
  share()
)

type Highlights = {
  highlight: boolean
  id: number
}

const TRADE_HIGHLIGHT_TIME_IN_MS = 3_000

const turnOn$ = highlightRequest$.pipe(
  map(interopMessage => ({
    highlight: true,
    id: interopMessage[0].tradeNotification,
  }))
)

const turnOff$ = highlightRequest$.pipe(
  delay(TRADE_HIGHLIGHT_TIME_IN_MS),
  map(interopMessage => ({
    highlight: false,
    id: interopMessage[0].tradeNotification,
  }))
)
export const highlightedRows$ = merge(turnOn$, turnOff$).pipe(
  scan<Highlights, Set<number>>((acc, next) => {
    if (next.highlight) {
      acc.add(next.id)
    } else {
      acc.delete(next.id)
    }
    return acc
  }, new Set<number>()),
  startWith(new Set())
)
