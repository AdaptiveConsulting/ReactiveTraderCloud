import { NotificationType } from '.'
import { Trade } from './trade'

export interface Notification {
  hasError: boolean
  notificationType: NotificationType
  message?: string
  trade: Trade
}
