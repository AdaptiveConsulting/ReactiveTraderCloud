import { Trade } from './';
import numeral from 'numeral';
import moment from 'moment';

export default class TradeNotification{

  spotRate: number;
  notional: string;
  direction: string;
  baseCurrency: string;
  termsCurrency: string;
  tradeId: string;
  tradeDate: string;
  tradeStatus: string;
  dealtCurrency:string;
  valueDate:string;

  constructor(trade: Trade){
    this.spotRate = trade.spotRate;
    this.notional = numeral(trade.notional).format('0,000,000[.]00');
    this.direction = trade.direction.name;
    this.baseCurrency = trade.currencyPair.base;
    this.tradeId = trade.tradeId;
    this.termsCurrency = trade.currencyPair.terms;
    this.tradeDate = trade.tradeDate;
    this.tradeStatus = trade.status.name;
    this.dealtCurrency = trade.dealtCurrency;
    this.valueDate = moment(trade.valueDate).format('DD MMM');
  }
}
