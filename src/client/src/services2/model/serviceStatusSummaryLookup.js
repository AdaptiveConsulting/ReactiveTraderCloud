import system from 'system';
import ServiceConst from './serviceConst';

export default class ServiceStatusSummaryLookup {
  _services:Object;
  constructor() {
    this._services = {};
  }
  update(serviceStatusSummary:system.service.ServiceStatusSummary) {
    this._services[serviceStatusSummary.serviceType] = serviceStatusSummary;
    return this;
  }

  get services() {
    return this._services;
  }

  get pricingStatus() {
    return this._services[ServiceConst.PricingServiceKey];
  }

  get referenceStatus() {
    return this._services[ServiceConst.ReferenceServiceKey];
  }

  get blotterStatus() {
    return this._services[ServiceConst.BlotterServiceKey];
  }

  get executionStatus() {
    return this._services[ServiceConst.ExecutionServiceKey];
  }

  get analyticspricingStatus() {
    return this._services[ServiceConst.AnalyticsServiceKey];
  }
}
