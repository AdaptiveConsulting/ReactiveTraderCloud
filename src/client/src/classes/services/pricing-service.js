/**
 * @class PricingService
 */
export default class PricingService {

  /**
   * @constructs PricingService
   * @param {transport} transport
   */
  constructor(transport){
    this.transport = transport;
  }

  /**
   * @param {string} symbol
   * @param {function} callback
   */
  getPriceUpdates(symbol, callback){
    console.log('called getPriceUpdates(' + symbol + ')');
    this.transport.requestStream('pricing', 'getPriceUpdates', {symbol}, callback);
  }
}
