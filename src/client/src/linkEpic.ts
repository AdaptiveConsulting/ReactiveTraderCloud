import { Action } from 'redux'
import { ofType } from 'redux-observable'
import { takeLast, tap } from 'rxjs/operators'
import { action } from './ActionHelper'
import { ApplicationEpic } from './ApplicationEpic'

export const OPEN_LINK = '@ReactiveTraderCloud/OPEN_LINK'
export const openLink = action<typeof OPEN_LINK, string>(OPEN_LINK)

export const linkEpic: ApplicationEpic = (action$, store, { openFin }) => {
  return action$.pipe(
    ofType<Action, ReturnType<typeof openLink>>(OPEN_LINK),
    tap(link => {
      if (openFin.isRunningInOpenFin) {
        openFin.openLink(link.payload)
      } else {
        window.open(link.payload, '_blank')
      }
    }),
    takeLast(1)
  )
}
