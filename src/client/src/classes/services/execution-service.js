/**
 * @class ExecutionService
 */
export default class ExecutionService {

  /**
   * @constructs ExecutionServiceTrader
   * @param {transport} transport
   */
  constructor(transport){
    this.transport = transport;
  }

  /**
   * @param options
   * @returns {*}
   */
  executeTrade(options){
    console.info('called executeTrade with', options);
    return this.transport.requestResponse('execution', 'executeTrade', options);
  }
}
