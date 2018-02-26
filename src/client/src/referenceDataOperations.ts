import { createAction } from 'redux-actions'

export enum ACTION_TYPES {
  REFERENCE_SERVICE = '@ReactiveTraderCloud/REFERENCE_SERVICE'
}

export const createReferenceServiceAction = createAction(ACTION_TYPES.REFERENCE_SERVICE)

export const referenceServiceEpic = refService$ => () => {
  return refService$.getCurrencyPairUpdatesStream().map(createReferenceServiceAction)
}
