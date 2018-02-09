import { NotificationType } from './index'
import { Direction } from './direction'

export interface Notification {
  tradeId: string
  hasError: boolean
  notificationType: NotificationType
  direction: Direction
  notional: string
  status: string
  spotRate: number
  dealtCurrency: string
  termsCurrency:string
  formattedValueDate: string
  message?: string
}
