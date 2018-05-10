import { createAction } from 'redux-actions'
import { map } from 'rxjs/operators'
import { ReferenceDataService } from './services'

export enum ACTION_TYPES {
  REFERENCE_SERVICE = '@ReactiveTraderCloud/REFERENCE_SERVICE'
}

export const createReferenceServiceAction = createAction(
  ACTION_TYPES.REFERENCE_SERVICE
)

export const referenceServiceEpic = (
  refService$: ReferenceDataService
) => () => {
  return refService$
    .getCurrencyPairUpdatesStream()
    .pipe(map(createReferenceServiceAction))
}
