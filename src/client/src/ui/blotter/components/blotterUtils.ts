import { ColDef } from 'ag-grid'
import { Trade, TradeStatus } from 'rt-types'
import { formatDate, UtcFormatDate } from '../../spotTile/components/notional/utils'
import SetFilter from './filters/SetFilter'
import numeral from 'numeral'
const dateRenderer = (trade: Trade, field: string) => {
  return formatDate(trade[field], '%d-%b %H:%M:%S')
}

const NotionalRenderer = (trade: Trade, field: string) => {
  return numeral(trade[field]).format('0,0[.]00')
}
const UtcDateRenderer = (trade: Trade, field: string, format: string = '%d-%b-%Y') => {
  return UtcFormatDate(trade[field], format)
}

const getStatusCellClass = (trade: Trade) => {
  if (trade.status === TradeStatus.Rejected) {
    return 'rt-blotter__cell-rejected'
  } else if (trade.status === TradeStatus.Pending) {
    return 'rt-blotter__cell-pending'
  } else if (trade.status === TradeStatus.Done) {
    return 'rt-blotter__cell-done'
  }
  return 'capitalise'
}

const getStatusIndicatorClass = (trade: Trade) => {
  switch (trade.status) {
    case TradeStatus.Rejected:
      return 'rt-blotter__status-i' + 'ndicator--rejected'
    case TradeStatus.Done:
      return 'rt-blotter__status-indicator--done'
    case TradeStatus.Pending:
      return 'rt-blotter__status-indicator--pending'
    default:
      console.log('unkown trade status')
  }
  return ''
}

export const DEFAULT_COLUMN_DEFINITION: ColDef = {
  menuTabs: ['filterMenuTab'],
  suppressSizeToFit: true,
  suppressFilter: false,
  minWidth: 40,
}

export const STATUS_INDICATOR = 'statusIndicator'
export const TRADE_ID = 'tradeId'
export const STATUS = 'status'
export const TRADE_DATE = 'tradeDate'
export const DIRECTION = 'direction'
export const SYMBOL = 'symbol'
export const DEALT_CURRENCY = 'dealtCurrency'
export const NOTIONAL = 'notional'
export const SPOT_RATE = 'spotRate'
export const VALUE_DATE = 'valueDate'
export const TRADER_NAME = 'traderName'

export const COLUMN_FIELDS = [
  STATUS_INDICATOR,
  TRADE_ID,
  STATUS,
  TRADE_DATE,
  DIRECTION,
  SYMBOL,
  DEALT_CURRENCY,
  NOTIONAL,
  SPOT_RATE,
  VALUE_DATE,
  TRADER_NAME,
]

export const columnDefinitions: ColDef[] = [
  {
    colId: STATUS_INDICATOR,
    headerName: '',
    field: STATUS_INDICATOR,
    width: 6,
    maxWidth: 6,
    minWidth: 6,
    cellClass: ({ data }) => getStatusIndicatorClass(data),
    suppressSorting: true,
    suppressMenu: true,
    headerClass: 'rt-status-indicator__header',
  },
  {
    colId: TRADE_ID,
    headerName: 'Trade ID',
    field: TRADE_ID,
    width: 100,
    filter: 'agNumberColumnFilter',
  },
  {
    colId: STATUS,
    headerName: 'Status',
    field: STATUS,
    width: 110,
    cellClass: ({ data }) => getStatusCellClass(data),
    filterFramework: SetFilter,
  },
  {
    colId: TRADE_DATE,
    headerName: 'Date',
    field: TRADE_DATE,
    cellRenderer: ({ data }) => dateRenderer(data, 'tradeDate'),
    width: 130,
    suppressFilter: true,
  },
  {
    colId: DIRECTION,
    headerName: 'Direction',
    field: DIRECTION,
    width: 110,
    filterFramework: SetFilter,
  },
  {
    colId: SYMBOL,
    headerName: 'CCYCCY',
    field: SYMBOL,
    width: 110,
    filterFramework: SetFilter,
  },
  {
    colId: DEALT_CURRENCY,
    headerName: 'Dealt CCY',
    field: DEALT_CURRENCY,
    width: 110,
    filterFramework: SetFilter,
  },
  {
    colId: NOTIONAL,
    headerName: 'Notional',
    field: NOTIONAL,
    cellClass: 'rt-blotter__numeric-cell',
    headerClass: 'rt-header__numeric',
    width: 120,
    filter: 'agNumberColumnFilter',
    cellRenderer: ({ data }) => NotionalRenderer(data, 'notional'),
  },
  {
    colId: SPOT_RATE,
    headerName: 'Rate',
    field: SPOT_RATE,
    width: 100,
    cellClass: 'rt-blotter__numeric-cell',
    headerClass: 'rt-header__numeric',
    filter: 'agNumberColumnFilter',
  },
  {
    colId: VALUE_DATE,
    headerName: 'Value Date',
    field: VALUE_DATE,
    cellRenderer: ({ data }) => UtcDateRenderer(data, 'valueDate'),
    width: 120,
    suppressFilter: true,
  },
  {
    colId: TRADER_NAME,
    field: TRADER_NAME,
    headerName: 'Trader',
    width: 110,
    filterFramework: SetFilter,
  },
  {
    colId: 'empty',
    field: 'empty',
    headerName: '',
    width: 80,
    suppressSizeToFit: false,
    suppressFilter: true,
  },
]
