import Connection from './connection';
import AutobahnConnectionProxy from './autobahn-connection-proxy';
import ServiceClient from './service-client';
import ConnectionStatus from './connection-status';
import ServiceInstanceStatus from './service-instance-status';
import ServiceStatus from './service-status';
import ServiceBase from './service-base';

// serviceObservableExtensions has no exports, it adds functionality to rx
import './service-observable-extensions';

export default {
  Connection,
  AutobahnConnectionProxy,
  ServiceClient,
  ConnectionStatus,
  ServiceInstanceStatus,
  ServiceStatus,
  ServiceBase
};
