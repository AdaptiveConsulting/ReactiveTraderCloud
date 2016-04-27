import { Trade, TradeStatus, Direction } from './';
import numeral from 'numeral';
import moment from 'moment';

export const BOUGHT = 'Bought';
export const SOLD = 'Sold';
export const DONE = 'Done';
export const REJECTED = 'REJECTED';

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
    this.direction = trade.direction == Direction.Buy ? BOUGHT : SOLD;
    this.baseCurrency = trade.currencyPair.base;
    this.tradeId = trade.tradeId;
    this.termsCurrency = trade.currencyPair.terms;
    this.tradeDate = trade.tradeDate;
    this.tradeStatus = trade.status == TradeStatus.Done ? DONE : REJECTED;
    this.dealtCurrency = trade.dealtCurrency;
    this.valueDate = moment(trade.valueDate).format('DD MMM');
  }
}
