import { createAction, handleActions } from 'redux-actions'
import * as _ from 'lodash'
import { ACTION_TYPES as REF_ACTION_TYPES } from './referenceDataOperations'
import { ServiceStatus, ServiceInstanceStatus } from './types/index'

export enum ACTION_TYPES {
  COMPOSITE_STATUS_SERVICE = '@ReactiveTraderCloud/COMPOSITE_STATUS_SERVICE'
}

export const createCompositeStatusServiceAction = createAction(ACTION_TYPES.COMPOSITE_STATUS_SERVICE)

export const compositeStatusServiceEpic = compositeStatusService$ => action$ => {
  // On init
  return (
    action$
      .ofType(REF_ACTION_TYPES.REFERENCE_SERVICE)
      // start listening to the serviceStatusStream
      .flatMapTo(compositeStatusService$.serviceStatusStream)
      // for each service status
      .map(service => getServiceStatus(service))
      .map(createCompositeStatusServiceAction)
  )
}

const getServiceStatus = service => {
  return _.mapValues(service.services, (service: ServiceStatus) => {
    return {
      isConnected: service.isConnected,
      connectedInstanceCount: countInstances(service.instanceStatuses),
      serviceType: service.serviceType
    }
  })
}
export default handleActions(
  {
    [ACTION_TYPES.COMPOSITE_STATUS_SERVICE]: (state, action) => action.payload
  },
  {}
)

export function countInstances(instances) {
  return instances.filter((instance: ServiceInstanceStatus) => instance.isConnected).length
}
