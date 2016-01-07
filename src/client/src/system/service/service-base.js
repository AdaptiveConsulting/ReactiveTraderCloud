import Connection from './connection';
import ServiceClient from './service-client';
import SchedulerService from '../schedulerService';

export default class ServiceBase {
  _serviceClient:ServiceClient;

  constructor(serviceType:String, connection:Connection, schedulerService:SchedulerService) {
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
