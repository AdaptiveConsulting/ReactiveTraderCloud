/**
 * @class AnalyticsService
 */
export default class AnalyticsService {

  /**
   * @constructs AnalyticsService
   * @param {transport} transport
   */
  constructor(transport){
    this.transport = transport;
  }

  /**
   * @param {function} callback
   */
  getAnalyticsStream(callback){
    this.transport.requestStream('analytics', 'getAnalyticsStream', {}, callback);
  }
}
