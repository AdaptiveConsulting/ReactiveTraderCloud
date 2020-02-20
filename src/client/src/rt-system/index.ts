import * as connectionStatus from './connectionStatus'
import * as serviceInstanceCollection from './ServiceInstanceCollection'
import * as serviceInstanceStatus from './serviceInstanceStatus'
import * as connectionStream from './connectionStream'
import * as connectionType from './connectionType'
import * as autoBahnConnection from './AutoBahnConnection'

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
export { default as ServiceClient } from './ServiceStubWithLoadBalancer'
export const { ConnectionEventType } = connectionStream
export type AutobahnConnection = autoBahnConnection.AutobahnConnection
export { default as AutobahnConnectionProxy } from './AutobahnConnectionProxy'

export const { createConnection$ } = connectionStream
export type ConnectionEvent = connectionStream.ConnectionEvent
export type ConnectionOpenEvent = connectionStream.ConnectionOpenEvent
export type ConnectionClosedEvent = connectionStream.ConnectionClosedEvent

export { default as AutobahnSessionProxy } from './AutobahnSessionProxy'
export { default as ServiceStubWithLoadBalancer } from './ServiceStubWithLoadBalancer'
export { serviceStatusStream$ } from './serviceStatusStream'
export { debounceWithSelector } from './debounceOnMissedHeartbeat'
