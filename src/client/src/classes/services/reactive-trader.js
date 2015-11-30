import PricingService from './pricing-service';
import ReferenceService from './reference-service';
import BlotterService from './blotter-service';
import ExecutionService from './execution-service';
import transport from '../transport';

/**
 * @class ReactiveTrader
 * @singleton
 */
class ReactiveTrader {

  /**
   * @constructs ReactiveTrader
   * @param {transport} transport
   */
  constructor(transport){
    this.pricing = new PricingService(transport);
    this.reference = new ReferenceService(transport);
    this.blotter = new BlotterService(transport);
    this.execution = new ExecutionService(transport);

    this.transport = transport;
  }

}

export default new ReactiveTrader(transport);
