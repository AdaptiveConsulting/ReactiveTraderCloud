import { utils } from '../../../system';
import { Trade, Direction } from '../../../services/model';
import { NotificationType  } from './';
import numeral from 'numeral';

export class NotificationBase {
  constructor(notificationType:NotificationType) {
    this.notificationType = notificationType;
  }
}

export class TextNotification extends NotificationBase {
  constructor(message:String) {
    super(NotificationType.Text);
    this.message = message;
  }
}

export class TradeExecutionNotification extends NotificationBase {
  direction:String;
  notional:String;
  status:String;
  dealtCurrency:String;
  termsCurrency:String;
  spotRate:String;
  formattedValueDate:String;
  tradeId:String;
  error:String;

  constructor(trade:Trade, error:String) {
    super(NotificationType.Trade);
    this.error = error;
    if (trade) {
      this.direction = trade.direction === Direction.Sell
        ? 'Sold'
        : 'Bought';
      this.notional = numeral(trade.notional).format('0,000,000[.]00');
      this.status = trade.status.name;
      this.dealtCurrency = trade.currencyPair.base;
      this.termsCurrency = trade.currencyPair.terms;
      this.spotRate = trade.spotRate;
      this.formattedValueDate = `SP. ${utils.formatDate(trade.valueDate, '%b %e')}`;
      this.tradeId = trade.tradeId;
    }
  }

  static createForSuccess(trade:Trade) {
    return new TradeExecutionNotification(trade);
  }

  static createForError(error:Error) {
    return new TradeExecutionNotification(null, error);
  }

  get hasError() {
    return typeof this.error !== 'undefined';
  }
}


