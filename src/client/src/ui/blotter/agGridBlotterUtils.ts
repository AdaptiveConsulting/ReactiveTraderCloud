import * as AgGrid from 'ag-grid'
import * as numeral from 'numeral'
import { Trade } from '../../types'


const currencyIconLookup = {
  ['USD']: `fa fa-usd`,
  ['AUD']: `fa fa-usd`,
  ['NZD']: `fa fa-usd`,
  ['GBP']: `fa fa-gbp`,
  ['EUR']: `fa fa-euro`,
  ['YEN']: `fa fa-yen`
}

const numericCellRenderer = (rowData:any):string => {
  // console.log(' ::: rowData : ', rowData)
  const trade = rowData.data as Trade
  const dealtCurrency = trade.dealtCurrency
  const icon = currencyIconLookup[dealtCurrency].toString()
  const renderer = `<span><div class="${icon}"></div> ${numeral(rowData.value).format('0,0')}</span>`
  return renderer
}

export const DEFAULT_COLUMN_DEFINITION:AgGrid.ColDef = {
  menuTabs: ['filterMenuTab']
}

export const COLUMN_DEFINITIONS:AgGrid.ColDef[] = [
  {
    colId: 'tradeId',
    headerName: 'Trade ID',
    field: 'tradeId',
    width: 105
  },
  {
    colId: 'date',
    headerName: 'Date',
    field: 'tradeDate',
    width: 180
  },
  {
    colId: 'direction',
    headerName: 'Direction',
    field: 'direction',
    width: 105
  },
  {
    colId: 'CCY',
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
    width: 140
  },
  {
    colId: 'rate',
    headerName: 'Rate',
    field: 'spotRate',
    width: 105
  },
  {
    colId: 'status',
    headerName: 'Status',
    field: 'status',
    width: 105
  },
  {
    colId: 'valueDate',
    headerName: 'Value Date',
    field: 'valueDate',
    width: 180
  },
  {
    colId: 'traderName',
    field: 'traderName',
    headerName: 'Trader',
    width: 105
  }
]
