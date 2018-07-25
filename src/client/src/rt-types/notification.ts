import { NotificationType } from './index'
import { Trade } from './trade'

export interface Notification {
  hasError: boolean
  notificationType: NotificationType
  message?: string
  trade: Trade
}
