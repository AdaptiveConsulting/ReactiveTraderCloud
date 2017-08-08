import { createAction } from 'redux-actions';

export enum ACTION_TYPES {
  COMPOSITE_STATUS_SERVICE = '@ReactiveTraderCloud/COMPOSITE_STATUS_SERVICE'
}

export const fetchCompositeServiceStatus = createAction(ACTION_TYPES.COMPOSITE_STATUS_SERVICE)

export const compositeStatusServiceEpic = compositeStatusService$ => action$ => {
  return compositeStatusService$.serviceStatusStream
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
