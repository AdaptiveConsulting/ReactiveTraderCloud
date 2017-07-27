import Connection from './connection';
import ServiceClient from './serviceClient';
import SchedulerService from '../schedulerService';
import { DisposableBase } from '../disposables';

export default class ServiceBase extends DisposableBase {
  _serviceClient;

  constructor(serviceType, connection, schedulerService) {
    super();

    this._serviceClient = new ServiceClient(
      serviceType,
      connection,
      schedulerService
    );
    this._schedulerService = schedulerService;
  }

  get serviceStatusStream() {
    return this._serviceClient.serviceStatusStream;
  }

  connect() {
    this._serviceClient.connect();
  }
}
