import { Notification, NotificationType, Trade } from 'rt-types'

export function buildNotification(trade: Trade = null, error?: string): Notification {
  if (error || !trade) {
    return {
      message: error,
      hasError: true,
      notificationType: NotificationType.Text,
      trade: null
    }
  }
  return {
    trade,
    notificationType: NotificationType.Trade,
    hasError: false
  }
}
