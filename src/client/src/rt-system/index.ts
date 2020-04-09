import * as serviceInstanceCollection from './ServiceInstanceCollection'
import * as serviceInstanceStatus from './serviceInstanceStatus'
import * as connectionStream from './connectionStream'

export type RawServiceStatus = serviceInstanceStatus.RawServiceStatus
export const { ServiceInstanceCollection } = serviceInstanceCollection
export type ServiceCollectionMap = serviceInstanceCollection.ServiceCollectionMap
export type ServiceConnectionInfo = serviceInstanceCollection.ServiceConnectionInfo
export const { ConnectionStatus } = connectionStream
export type ConnectionStatusType = connectionStream.ConnectionStatus
export type IServiceStatusCollection = serviceInstanceCollection.IServiceStatusCollection
export { retryWithBackOff, retryConstantly } from './retryPolicy'
export { ServiceStub as ServiceClient } from './ServiceStub'
export { default as WsConnection } from './WsConnection'

export const { connectionStream$ } = connectionStream
export type ConnectionInfo = connectionStream.ConnectionInfo

export { serviceStatusStream$ } from './serviceStatusStream'
export { debounceWithSelector } from './debounceOnMissedHeartbeat'
