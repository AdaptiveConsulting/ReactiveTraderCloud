import { ACTION_TYPES as REF_ACTION_TYPES } from '../../redux/actions/referenceDataActions'
import { createNewTradesAction } from './actions'

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

export default blotterServiceEpic
