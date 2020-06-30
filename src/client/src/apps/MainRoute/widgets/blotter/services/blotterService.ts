import { combineLatest } from 'rxjs'
import { map, shareReplay, filter, startWith } from 'rxjs/operators'
import { highlightedRows$ } from './tradeHighlight'
import { rows$ } from './tradeService'
import { compositeStatusService } from 'apps/MainRoute/store/singleServices'
import { ServiceConnectionStatus } from 'rt-types'
export const blotter$ = combineLatest(rows$, highlightedRows$).pipe(
  map(([rows, highlighted]) => {
    return rows.map(row => {
      if (highlighted.has(row.tradeId)) {
        return { ...row, highlight: true }
      }
      if (row.highlight) {
        return { ...row, highlight: false }
      }
      return row
    })
  }),
  shareReplay(1)
)

const BLOTTER = 'blotter'
export const blotterConnection$ = compositeStatusService.serviceStatusStream.pipe(
  filter(statusMap => !!statusMap[BLOTTER]),
  map(statusMap => statusMap[BLOTTER].connectionStatus),
  startWith(ServiceConnectionStatus.CONNECTING),
  shareReplay(1)
)
