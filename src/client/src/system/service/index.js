import Connection from './connection';
import AutobahnConnectionProxy from './autobahnConnectionProxy';
import ServiceClient from './serviceClient';
import ServiceInstanceStatus from './serviceInstanceStatus';
import ServiceStatusSummary from './serviceStatusSummary';
import ServiceInstanceSummary from './serviceInstanceSummary';

// serviceObservableExtensions has no exports, it adds functionality to rx
import './serviceObservableExtensions';

export default {
  Connection,
  AutobahnConnectionProxy,
  ServiceClient,
  ServiceInstanceStatus,
  ServiceStatusSummary,
  ServiceInstanceSummary
};
