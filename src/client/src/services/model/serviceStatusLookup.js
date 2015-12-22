import system from 'system';
import ServiceConst from './serviceConst';

/**
 * A data structure that can be used to look up the current statuses of well known services.
 */
export default class ServiceStatusLookup {
  _services:Object;

  constructor() {
    this._services = {};
  }

  updateServiceStatus(serviceStatus:system.service.ServiceStatus) {
    this._services[serviceStatus.serviceType] = serviceStatus;
    return this;
  }

  get services() {
    return this._services;
  }

  get pricing():system.service.ServiceStatus {
    return this._services[ServiceConst.PricingServiceKey];
  }

  get reference():system.service.ServiceStatus {
    return this._services[ServiceConst.ReferenceServiceKey];
  }

  get blotter():system.service.ServiceStatus {
    return this._services[ServiceConst.BlotterServiceKey];
  }

  get execution():system.service.ServiceStatus {
    return this._services[ServiceConst.ExecutionServiceKey];
  }

  get analytics():system.service.ServiceStatus {
    return this._services[ServiceConst.AnalyticsServiceKey];
  }
}
