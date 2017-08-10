import { createAction } from 'redux-actions';
import { ACTION_TYPES as REF_ACTION_TYPES } from '../reference/referenceOperations';

export enum ACTION_TYPES {
  COMPOSITE_STATUS_SERVICE = '@ReactiveTraderCloud/COMPOSITE_STATUS_SERVICE'
}

export const fetchCompositeServiceStatus = createAction(ACTION_TYPES.COMPOSITE_STATUS_SERVICE)

export const compositeStatusServiceEpic = compositeStatusService$ => action$ => {
  return action$.ofType(REF_ACTION_TYPES.REFERENCE_SERVICE)
    .flatMapTo(compositeStatusService$.serviceStatusStream)
    .map(fetchCompositeServiceStatus);
}

export const compositeStatusServiceReducer = (state = {}, action) => {
  switch (action.type) {
    case ACTION_TYPES.COMPOSITE_STATUS_SERVICE:
      return action.payload
    default:
      return state
  }
}
