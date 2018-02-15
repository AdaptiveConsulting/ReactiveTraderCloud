import * as AgGrid from 'ag-grid'
import * as numeral from 'numeral'
import { Trade, TradeStatus } from '../../types'
import RateCellRenderer from './renderers/RateCellRenderer'
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
  const renderer = `<span><div class="${icon}"></div> ${numeral(rowData.value).format('0,0')}</span>`
  return renderer
}

const dateRenderer = (trade:Trade, field: string) => {
  return formatDate(trade[field], '%d-%b %H:%M:%S')
}

const getCellClass = (trade:Trade) => {
  if (trade.status === TradeStatus.Rejected) {
    return 'rt-blotter__cell-rejected'
  } else if (trade.status === TradeStatus.Done) {
    return 'rt-blotter__cell-done'
  } else if (trade.status === TradeStatus.Pending) {
    return 'rt-blotter__cell-pending'
  }

  return null
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

export function getColumnDefinitions(useRateRenderer:boolean = false):AgGrid.ColDef[] {
  return [
    {
      colId: 'statusIndicator',
      headerName: '',
      field: 'statusIndicator',
      width: 7,
      maxWidth: 7,
      cellClass: ({ data }) => getStatusIndicatorClass(data),
      suppressFilter: true,
      suppressSorting: true,
      suppressMenu: true,
      suppressMovable: true,
      suppressResize: true,
      minWidth: 8,
      headerClass: 'rt-status-indicator__header'
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
      cellClass: ({ data }) => getCellClass(data)
    },
    {
      colId: 'tradeDate',
      headerName: 'Date',
      field: 'tradeDate',
      cellRenderer: ({ data }) => dateRenderer(data, 'tradeDate'),
      width: 180
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
      width: 105
    },
    {
      colId: 'notional',
      headerName: 'Notional',
      field: 'notional',
      cellRenderer: numericCellRenderer,
      width: 140,
      filter: 'number'
    },
    {
      colId: 'spotRate',
      headerName: 'Rate',
      field: 'spotRate',
      width: 140,
      cellRendererFramework: useRateRenderer ?  RateCellRenderer : null,
      filter: 'number',
      headerClass: useRateRenderer ? 'rt-blotter__numeric-header' : null
    },
    {
      colId: 'valueDate',
      headerName: 'Value Date',
      field: 'valueDate',
      cellRenderer: ({ data }) => dateRenderer(data, 'valueDate'),
      width: 180,
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

