import * as AgGrid from 'ag-grid'
import * as numeral from 'numeral'
import { Trade, TradeStatus } from '../../types'
import { formatDate } from '../../system/utils'

const currencyIconLookup = {
  ['USD']: `fa fa-usd`,
  ['AUD']: `fa fa-usd`,
  ['NZD']: `fa fa-usd`,
  ['GBP']: `fa fa-gbp`,
  ['EUR']: `fa fa-euro`,
  ['YEN']: `fa fa-yen`
}

const numericCellRenderer = (rowData:any):string => {
  const trade = rowData.data as Trade
  const dealtCurrency = trade.dealtCurrency
  const icon = currencyIconLookup[dealtCurrency].toString()
  const renderer = `<span></div> ${numeral(rowData.value).format('0,0')}<div class='${icon} rt-blotter__ccy-symbol'></span>`
  return renderer
}

const dateRenderer = (trade:Trade, field: string) => {
  return formatDate(trade[field], '%d-%b %H:%M:%S')
}

const getStatusCellClass = (trade:Trade) => {
  if (trade.status === TradeStatus.Rejected) {
    return 'rt-blotter__cell-rejected'
  } else if (trade.status === TradeStatus.Pending) {
    return 'rt-blotter__cell-pending'
  }
  return 'capitalise'
}

const getStatusIndicatorClass = (trade:Trade) => {

  switch (trade.status) {
    case TradeStatus.Rejected:
      return 'rt-blotter__status-i' +
        'ndicator--rejected'
    case TradeStatus.Done:
      return 'rt-blotter__status-indicator--done'
    case TradeStatus.Pending:
      return 'rt-blotter__status-indicator--pending'
  }
  return null
}

export const DEFAULT_COLUMN_DEFINITION:AgGrid.ColDef = {
  menuTabs: ['filterMenuTab'],
  suppressSizeToFit: true,
  suppressFilter: true
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
  STATUS_INDICATOR, TRADE_ID, STATUS, TRADE_DATE, DIRECTION,
  SYMBOL, DEALT_CURRENCY, NOTIONAL, SPOT_RATE, VALUE_DATE, TRADER_NAME
]

export function getColumnDefinitions():AgGrid.ColDef[] {
  return [
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
      width: 80,
      filter: 'number'
    },
    {
      colId: STATUS,
      headerName: 'Status',
      field: STATUS,
      width: 105,
      cellClass: ({ data }) => getStatusCellClass(data)
    },
    {
      colId: TRADE_DATE,
      headerName: 'Date',
      field: TRADE_DATE,
      cellRenderer: ({ data }) => dateRenderer(data, 'tradeDate'),
      width: 170
    },
    {
      colId: DIRECTION,
      headerName: 'Direction',
      field: DIRECTION,
      width: 105
    },
    {
      colId: SYMBOL,
      headerName: 'CCYCCY',
      field: SYMBOL,
      width: 105
    },
    {
      colId: DEALT_CURRENCY,
      headerName: 'Dealt CCY',
      field: DEALT_CURRENCY,
      width: 105
    },
    {
      colId: NOTIONAL,
      headerName: 'Notional',
      field: NOTIONAL,
      cellRenderer: numericCellRenderer,
      cellClass: 'rt-blotter__numeric-cell',
      headerClass: 'rt-header__numeric',
      width: 140
    },
    {
      colId: SPOT_RATE,
      headerName: 'Rate',
      field: SPOT_RATE,
      width: 120,
      cellClass:  'rt-blotter__numeric-cell',
      headerClass: 'rt-header__numeric'
    },
    {
      colId: VALUE_DATE,
      headerName: 'Value Date',
      field: VALUE_DATE,
      cellRenderer: ({ data }) => dateRenderer(data, 'valueDate'),
      width: 170
    },
    {
      colId: TRADER_NAME,
      field: TRADER_NAME,
      headerName: 'Trader',
      width: 105
    },
    {
      colId: 'empty',
      field: 'empty',
      headerName: '',
      width: 105,
      suppressSizeToFit: false,
    }
  ]
}
