import { NotificationType } from '../../types/notificationType'
import * as numeral from 'numeral'
import { Direction } from '../../types/direction'
import { timeFormat } from 'd3-time-format'
import { Trade } from '../../types'

export function buildNotification(trade:Trade = null, error) {
  if (error || !trade) {
    return { message: error, hasError: true, notificationType: NotificationType.Text }
  }
  return {
    notificationType: NotificationType.Trade,
    hasError: false,
    direction: trade.direction === Direction.Sell ? 'Sold' : 'Bought',
    notional: numeral(trade.notional).format('0,000,000[.]00'),
    status: trade.status,
    dealtCurrency: trade.dealtCurrency,
    termsCurrency: trade.termsCurrency,
    spotRate: trade.spotRate,
    formattedValueDate: `SP. ${timeFormat('%b %e')(trade.valueDate)}`,
    tradeId: trade.tradeId,
  }
}
