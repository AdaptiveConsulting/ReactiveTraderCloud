import { combineLatest } from 'rxjs'
import { map, shareReplay } from 'rxjs/operators'
import { highlightedRows$ } from './tradeHighlight'
import { rows$ } from './tradeService'
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
