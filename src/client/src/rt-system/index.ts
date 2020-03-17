import * as connectionStatus from './connectionStatus'
import * as serviceInstanceCollection from './ServiceInstanceCollection'
import * as serviceInstanceStatus from './serviceInstanceStatus'
import * as connectionStream from './connectionStream'
import * as connectionType from './connectionType'
import * as wsConnection from './WsConnection'

export type RawServiceStatus = serviceInstanceStatus.RawServiceStatus
export const { ServiceInstanceCollection } = serviceInstanceCollection
export type ServiceCollectionMap = serviceInstanceCollection.ServiceCollectionMap
export type ServiceConnectionInfo = serviceInstanceCollection.ServiceConnectionInfo
export type ConnectionStatusType = connectionStatus.ConnectionStatus
export const { ConnectionStatus } = connectionStatus
export type ConnectionState = connectionStatus.ConnectionState
export type IServiceStatusCollection = serviceInstanceCollection.IServiceStatusCollection
export { retryWithBackOff, retryConstantly } from './retryPolicy'
export type ConnectionType = connectionType.ConnectionType
export { ServiceStub } from './ServiceStub'
export { ServiceStub as ServiceClient } from './ServiceStub'
export const { ConnectionEventType } = connectionStream
export type WsConnection = wsConnection.WsConnection
export { default as WsConnectionProxy } from './WsConnectionProxy'

export const { connectionStream$ } = connectionStream
export type ConnectionEvent = connectionStream.ConnectionEvent

export { serviceStatusStream$ } from './serviceStatusStream'
export { debounceWithSelector } from './debounceOnMissedHeartbeat'
