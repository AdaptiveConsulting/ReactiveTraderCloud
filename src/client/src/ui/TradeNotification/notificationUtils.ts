import { timeFormat } from 'd3-time-format'
import { Notification, NotificationType, Trade } from './'

export function buildNotification(trade: Trade = null, error): Notification {
  if (error || !trade) {
    return { message: error, hasError: true, notificationType: NotificationType.Text, trade: null }
  }
  return {
    trade,
    notificationType: NotificationType.Trade,
    hasError: false
  }
}
