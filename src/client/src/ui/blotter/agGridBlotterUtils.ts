import * as AgGrid from 'ag-grid'

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
    field: 'currencyPair.symbol',
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
