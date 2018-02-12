import * as AgGrid from 'ag-grid'

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
    width: 150
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
    width: 105
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
    width: 105
  },
  {
    colId: 'traderName',
    field: 'traderName',
    headerName: 'Trader',
    width: 105
  }
]
