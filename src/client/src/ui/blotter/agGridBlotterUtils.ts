import * as AgGrid from 'ag-grid'
import * as numeral from 'numeral'
import { Trade, TradeStatus } from '../../types'
import RateCellRenderer from './renderers/RateCellRenderer'
import { formatDate } from '../../system/utils'
import CurrencyFilter from './filters/CurrencyFilter'

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
      return 'rt-blotter__status-indicator--rejected'
    case TradeStatus.Done:
      return 'rt-blotter__status-indicator--done'
    case TradeStatus.Pending:
      return 'rt-blotter__status-indicator--pending'
  }
  return null
}

export const DEFAULT_COLUMN_DEFINITION:AgGrid.ColDef = {
  menuTabs: ['filterMenuTab'],
  suppressSizeToFit: true
}

export const frameworkComponents = {
  currencyFilter: CurrencyFilter
}

export function getColumnDefinitions(useRateRenderer:boolean = false):AgGrid.ColDef[] {
  return [
    {
      colId: 'statusIndicator',
      headerName: '',
      field: 'statusIndicator',
      width: 6,
      maxWidth: 6,
      minWidth: 6,
      cellClass: ({ data }) => getStatusIndicatorClass(data),
      suppressFilter: true,
      suppressSorting: true,
      suppressMenu: true,
      headerClass: 'rt-status-indicator__header',
    },
    {
      colId: 'tradeId',
      headerName: 'Trade ID',
      field: 'tradeId',
      width: 105
    },
    {
      colId: 'status',
      headerName: 'Status',
      field: 'status',
      width: 105,
      cellClass: ({ data }) => getStatusCellClass(data)
    },
    {
      colId: 'tradeDate',
      headerName: 'Date',
      field: 'tradeDate',
      cellRenderer: ({ data }) => dateRenderer(data, 'tradeDate'),
      width: 170
    },
    {
      colId: 'direction',
      headerName: 'Direction',
      field: 'direction',
      width: 105
    },
    {
      colId: 'symbol',
      headerName: 'CCYCCY',
      field: 'symbol',
      width: 105
    },
    {
      colId: 'dealtCurrency',
      headerName: 'Dealt CCY',
      field: 'dealtCurrency',
      filterFramework: CurrencyFilter,
      width: 105
    },
    {
      colId: 'notional',
      headerName: 'Notional',
      field: 'notional',
      cellRenderer: numericCellRenderer,
      cellClass: 'rt-blotter__numeric-cell',
      headerClass: 'rt-header__numeric',
      width: 140,
      filter: 'number'
    },
    {
      colId: 'spotRate',
      headerName: 'Rate',
      field: 'spotRate',
      width: 120,
      cellRendererFramework: useRateRenderer ?  RateCellRenderer : null,
      cellClass: useRateRenderer ? 'rt-blotter__numeric-cell--decimmal' : 'rt-blotter__numeric-cell',
      filter: 'number',
      headerClass: useRateRenderer ? 'rt-blotter__rates-custom-header' : 'rt-header__numeric'
    },
    {
      colId: 'valueDate',
      headerName: 'Value Date',
      field: 'valueDate',
      cellRenderer: ({ data }) => dateRenderer(data, 'valueDate'),
      width: 170,
      filter: 'date'
    },
    {
      colId: 'traderName',
      field: 'traderName',
      headerName: 'Trader',
      width: 105
    },
    {
      colId: 'empty',
      field: 'empty',
      headerName: '',
      width: 105,
      suppressSizeToFit: false
    }
  ]
}

