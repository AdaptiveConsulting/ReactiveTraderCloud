import { Trade } from '../../../types'
import { NotificationType } from '../../../types'
import { Notification } from '../../../types/notification'

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
