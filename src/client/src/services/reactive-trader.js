import PricingService from './pricing-service';
import ReferenceService from './reference-service';
import BlotterService from './blotter-service';
import ExecutionService from './execution-service';
import transport from './transport';
import emitter from '../utils/emitter';

const DISCONNECT_SESSION_AFTER = 1000 * 60 * 15;

/**
 * @class ReactiveTrader
 * @singleton
 */
class ReactiveTrader extends emitter {

  /**
   * @constructs ReactiveTrader
   * @param {transport} transport
   */
  constructor(transport){
    super();
    transport.isConnected || transport.open();
    this.pricing = new PricingService(transport);
    this.reference = new ReferenceService(transport);
    this.blotter = new BlotterService(transport);
    this.execution = new ExecutionService(transport);

    this.transport = transport;

    this.transport
      .on('timeout', () => this.trigger('timeout'))
      .on('open', () =>{
        this.sessionDisconnectTimer = setTimeout(() =>{
          this.trigger('timeout');
          this.transport.close();
          this.transport.markEverythingAsDead();
        }, DISCONNECT_SESSION_AFTER);
      });
  }

}

export default new ReactiveTrader(transport);
