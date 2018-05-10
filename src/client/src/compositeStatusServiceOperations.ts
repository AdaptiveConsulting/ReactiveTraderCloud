import { createAction, handleActions } from 'redux-actions'
import { map } from 'rxjs/operators'
import { CompositeStatusService } from './services'

export enum ACTION_TYPES {
  COMPOSITE_STATUS_SERVICE = '@ReactiveTraderCloud/COMPOSITE_STATUS_SERVICE'
}

export const createCompositeStatusServiceAction = createAction(
  ACTION_TYPES.COMPOSITE_STATUS_SERVICE
)

export const compositeStatusServiceEpic = (
  compositeStatusService$: CompositeStatusService
) => action$ => {
  // On init
  return compositeStatusService$.serviceStatusStream.pipe(
    map(createCompositeStatusServiceAction)
  )
}

export default handleActions(
  {
    [ACTION_TYPES.COMPOSITE_STATUS_SERVICE]: (state, action) => action.payload
  },
  {}
)
