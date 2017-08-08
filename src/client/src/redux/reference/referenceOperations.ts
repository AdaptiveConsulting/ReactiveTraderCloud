
export const ACTION_TYPES = {
  REFERENCE_SERVICE: 'REFERENCE_SERVICE'
}

export const fetchReference = payload => ({ type: ACTION_TYPES.REFERENCE_SERVICE, payload })

export const referenceServiceEpic = refService$ => action$ => {
  return refService$
    .map(fetchReference);
}

export const referenceServiceReducer = (state = {}, action) => {
  switch (action.type) {
    case ACTION_TYPES.REFERENCE_SERVICE:
      return action.payload.currencyPairUpdates
    default:
      return state
    }
}
