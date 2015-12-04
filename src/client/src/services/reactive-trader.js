import PricingService from './pricing-service';
import ReferenceService from './reference-service';
import BlotterService from './blotter-service';
import ExecutionService from './execution-service';
import AnalyticsService from './analytics-service';

import transport from './transport';
import emitter from '../utils/emitter';
import utils from '../utils';

const DISCONNECT_SESSION_AFTER = 1000 * 60 * 15;

/**
 * @class ReactiveTrader
 * @singleton
 */
@utils.mixin(emitter)
class ReactiveTrader {

  /**
   * @constructs ReactiveTrader
   * @param {transport} transport
   */
  constructor(transport){
    transport.isConnected || transport.open();
    this.pricing = new PricingService(transport);
    this.reference = new ReferenceService(transport);
    this.blotter = new BlotterService(transport);
    this.execution = new ExecutionService(transport);
    this.analytics = new AnalyticsService(transport);

    this.transport = transport;

    this.transport
      .on('timeout', () => this.trigger('timeout'))
      .on('open', () =>{
        this.sessionDisconnectTimer = setTimeout(() =>{
          this.trigger('timeout');
          this.transport.close();
          this.transport.markEverythingAsDead();
        }, 5000);
      });
  }

}

export default new ReactiveTrader(transport);
