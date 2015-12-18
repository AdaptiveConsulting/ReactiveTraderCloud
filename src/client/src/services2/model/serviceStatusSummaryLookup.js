import system from 'system';

export default class ServiceStatusSummaryLookup {
  _services:Object;
  constructor() {
    this._services = {};
  }
  update(serviceStatusSummary:system.service.ServiceStatusSummary) {
    this._services[serviceStatusSummary.serviceType] = serviceStatusSummary;
    return this;
  }
}
