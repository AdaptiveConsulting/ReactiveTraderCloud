import { BlotterService } from '../generated/TradingGateway'
import { withConnection } from './connection'

export const trades$ = BlotterService.getTradeStream().pipe(withConnection())
