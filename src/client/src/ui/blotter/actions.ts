import { ACTION_TYPES as REF_ACTION_TYPES } from '../../redux/actions/referenceDataActions'
import { createAction } from 'redux-actions'

export const ACTION_TYPES = {
  BLOTTER_SERVICE_NEW_TRADES: '@ReactiveTraderCloud/BLOTTER_SERVICE_NEW_TRADES',
}

export const createNewTradesAction = createAction(ACTION_TYPES.BLOTTER_SERVICE_NEW_TRADES)

const subscribeOpenFinToBlotterData = (openFin, store) => () => {
  const cb = (msg, uuid) => openFin.sendAllBlotterData(uuid, store.getState().blotterService.trades)
  openFin.addSubscription('fetch-blotter', cb)
}

export const blotterServiceEpic = (blotterService$, openFin) => (action$, store) => {
  return action$.ofType(REF_ACTION_TYPES.REFERENCE_SERVICE)
    .do(subscribeOpenFinToBlotterData(openFin, store))
    .flatMapTo(blotterService$.getTradesStream())
    .map(createNewTradesAction)
}
