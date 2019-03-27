import { Action } from 'redux'
import { ofType } from 'redux-observable'
import { delay, map, takeUntil } from 'rxjs/operators'
import { ApplicationEpic } from 'StoreTypes'
import { TILE_ACTION_TYPES, SpotTileActions } from '../actions'

const { rfqRequest, rfqReceived, rfqCancel } = SpotTileActions

type RfqRequest = ReturnType<typeof rfqRequest>
type RfqCancel = ReturnType<typeof rfqCancel>

// TODO listen to the price stream
export const rfqRequestEpic: ApplicationEpic = action$ => {
  console.log('rfqRequestEpic')
  return action$.pipe(
    ofType<Action, RfqRequest>(TILE_ACTION_TYPES.RFQ_REQUEST),
    delay(Math.random() * (10000 - 0)),
    map(action =>
      rfqReceived({
        ...action.payload,
        price: Math.random() * (3 - 0),
      }),
    ),
    // TODO fix this as it will prevent any following request
    takeUntil(action$.pipe(ofType<Action, RfqCancel>(TILE_ACTION_TYPES.RFQ_CANCEL))),
  )
}
