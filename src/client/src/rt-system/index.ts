import * as connectionStatus from './connectionStatus'
import * as serviceInstanceCollection from './ServiceInstanceCollection'
import * as serviceInstanceStatus from './serviceInstanceStatus'
import * as connectionStream from './connectionStream'

export type RawServiceStatus = serviceInstanceStatus.RawServiceStatus
export const { ServiceInstanceCollection } = serviceInstanceCollection
export type ServiceCollectionMap = serviceInstanceCollection.ServiceCollectionMap
export type ServiceConnectionInfo = serviceInstanceCollection.ServiceConnectionInfo
export type ConnectionStatusType = connectionStatus.ConnectionStatus
export const { ConnectionStatus } = connectionStatus
export type ConnectionState = connectionStatus.ConnectionState
export type IServiceStatusCollection = serviceInstanceCollection.IServiceStatusCollection
export { retryWithBackOff, retryConstantly } from './retryPolicy'
export { ServiceStub } from './ServiceStub'
export { default as ServiceClient } from './ServiceStubWrapper'
export const { ConnectionEventType } = connectionStream
export { default as WsConnection } from './WsConnection'

export const { connectionStream$ } = connectionStream
export type ConnectionEvent = connectionStream.ConnectionEvent

export { serviceStatusStream$ } from './serviceStatusStream'
export { debounceWithSelector } from './debounceOnMissedHeartbeat'
