import * as numeral from 'numeral';
import * as moment from 'moment';

import Trade from './trade';

export default class TradeNotification {

  spotRate: number;
  notional: string;
  direction: string;
  currencyPair: string;
  baseCurrency: string;
  termsCurrency: string;
  tradeId: string;
  tradeDate: string;
  tradeStatus: string;
  dealtCurrency: string;
  valueDate: string;

  constructor(trade: Trade) {
    this.spotRate = trade.spotRate;
    this.notional = numeral(trade.notional).format('0,000,000[.]00');
    this.direction = trade.direction.name;
    this.baseCurrency = trade.currencyPair.base;
    this.tradeId = trade.tradeId.toString();
    this.termsCurrency = trade.currencyPair.terms;
    this.currencyPair = `${this.baseCurrency} / ${this.termsCurrency}`;
    this.tradeDate = moment(trade.tradeDate).format();
    this.tradeStatus = trade.status.name;
    this.dealtCurrency = trade.dealtCurrency;
    this.valueDate = moment(trade.valueDate).format('DD MMM');
  }
}
