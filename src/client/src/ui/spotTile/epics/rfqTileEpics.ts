import { Action } from 'redux'
import { ofType } from 'redux-observable'
import { delay, map } from 'rxjs/operators'
import { ApplicationEpic } from 'StoreTypes'
import { TILE_ACTION_TYPES, SpotTileActions } from '../actions'

const { rfqRequest, rfqReceived } = SpotTileActions

type RfqRequest = ReturnType<typeof rfqRequest>

// TODO listen to the price stream
export const rfqRequestEpic: ApplicationEpic = action$ =>
  action$.pipe(
    ofType<Action, RfqRequest>(TILE_ACTION_TYPES.RFQ_REQUEST),
    delay(Math.random() * (10000 - 0)),
    map(action =>
      rfqReceived({
        ...action.payload,
        price: Math.random() * (3 - 0),
      }),
    ),
  )
