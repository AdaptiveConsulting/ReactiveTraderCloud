import { ServiceStatus } from '../../system/service';
import ServiceConst from './serviceConst';

/**
 * A data structure that can be used to look up the current statuses of well known services.
 */
export default class ServiceStatusLookup {
  _services:Object;

  constructor() {
    this._services = {};
  }

  updateServiceStatus(serviceStatus:ServiceStatus) {
    this._services[serviceStatus.serviceType] = serviceStatus;
    return this;
  }

  get services() {
    return this._services;
  }

  get pricing():ServiceStatus {
    return this._services[ServiceConst.PricingServiceKey];
  }

  get reference():ServiceStatus {
    return this._services[ServiceConst.ReferenceServiceKey];
  }

  get blotter():ServiceStatus {
    return this._services[ServiceConst.BlotterServiceKey];
  }

  get execution():ServiceStatus {
    return this._services[ServiceConst.ExecutionServiceKey];
  }

  get analytics():ServiceStatus {
    return this._services[ServiceConst.AnalyticsServiceKey];
  }
}
