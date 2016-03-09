
import Connection from './connection';
import ServiceClient from './serviceClient';
import SchedulerService from '../schedulerService';
import { DisposableBase } from '../disposables';

export default class ServiceBase extends DisposableBase {
  _serviceClient:ServiceClient;

  constructor(serviceType:string, connection:Connection, schedulerService:SchedulerService) {
    super();

    this._serviceClient = new ServiceClient(
      serviceType,
      connection,
      schedulerService
    );
    this._schedulerService = schedulerService;
  }

  get serviceStatusStream():Rx.Observable<system.service.ServiceStatus> {
    return this._serviceClient.serviceStatusStream;
  }

  connect() {
    this._serviceClient.connect();
  }
}
