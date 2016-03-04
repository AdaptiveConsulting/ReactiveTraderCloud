import { Trade } from '../../../services/model';

export default class TradeExecutionNotification {
  trade:Trade;
  error:String;

  constructor(trade:Trade, error:String) {
      this.trade = trade;
      this.error = error;
  }

  get hasError() {
    return typeof this.error !== 'undefined';
  }
}
