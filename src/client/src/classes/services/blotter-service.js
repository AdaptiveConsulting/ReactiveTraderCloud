/**
 * @class BlotterService
 */
export default class BlotterService {

  /**
   * @constructs BlotterService
   * @param {transport} transport
   */
  constructor(transport){
    this.transport = transport;
  }

  /**
   * @param {function} callback
   */
  getTradesStream(callback){
    console.log('called getTradesStream');
    this.transport.requestStream('blotter', 'getTradesStream', {}, callback);
  }
}
