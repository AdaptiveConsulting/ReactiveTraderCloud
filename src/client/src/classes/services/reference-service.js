/**
 * @class ReferenceService
 */
export default class ReferenceService {

  /**
   * @constructs ReferenceService
   * @param {transport} transport
   */
  constructor(transport){
    this.transport = transport;
  }

  /**
   * @param {function} callback
   */
  getCurrencyPairUpdatesStream(callback){
    console.log('called getCurrencyPairUpdatesStream');
    this.transport.requestStream('reference', 'getCurrencyPairUpdatesStream', {}, callback);
  }
}
