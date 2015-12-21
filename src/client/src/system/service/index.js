import Connection from './connection';
import AutobahnConnectionProxy from './autobahnConnectionProxy';
import ServiceClient from './serviceClient';
import ServiceInstanceStatus from './serviceInstanceStatus';
import ServiceStatus from './serviceStatus';

// serviceObservableExtensions has no exports, it adds functionality to rx
import './serviceObservableExtensions';

export default {
  Connection,
  AutobahnConnectionProxy,
  ServiceClient,
  ServiceInstanceStatus,
  ServiceStatus,
};
