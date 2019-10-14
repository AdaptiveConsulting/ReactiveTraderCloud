import { ColDef, CsvExportParams, ProcessCellForExportParams } from 'ag-grid-community'
import { DateTime } from 'luxon'
import { Trade, TradeStatus } from 'rt-types'
import SetFilter from './filters/SetFilter'
import numeral from 'numeral'
import { capitalize } from 'lodash'

function UtcFormatDate(date: Date) {
  return DateTime.fromJSDate(date, { zone: 'utc' }).toFormat('dd-MMM-yyyy')
}

const notionalRenderer = (value: any) => {
  return numeral(value).format('0,0[.]00')
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
      return 'rt-blotter__status-indicator--rejected'
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
  filter: false,
  minWidth: 40,
  resizable: true,
  sortable: true,
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

interface ColCSVSettings {
  includeInCSVExport?: boolean
  /** Custom formatter for CSV cell values. If omitted will use default value */
  csvCellValueFormatter?: (params: ProcessCellForExportParams) => string
}

export const columnDefinitions: Array<ColDef & ColCSVSettings> = [
  {
    colId: STATUS_INDICATOR,
    headerName: '',
    field: STATUS_INDICATOR,
    width: 6,
    maxWidth: 6,
    minWidth: 6,
    cellClass: ({ data }) => getStatusIndicatorClass(data),
    sortable: false,
    suppressMenu: true,
    headerClass: 'rt-status-indicator__header',
  },
  {
    colId: TRADE_ID,
    headerName: 'Trade ID',
    field: TRADE_ID,
    width: 100,
    filter: 'agNumberColumnFilter',
    includeInCSVExport: true,
  },
  {
    colId: STATUS,
    headerName: 'Status',
    field: STATUS,
    width: 110,
    cellClass: ({ data }) => getStatusCellClass(data),
    filterFramework: SetFilter,
    includeInCSVExport: true,
    csvCellValueFormatter: cell => capitalize(cell.value),
  },
  {
    colId: TRADE_DATE,
    headerName: 'Trade Date',
    field: TRADE_DATE,
    cellRenderer: ({ data }) => UtcFormatDate(data['tradeDate']),
    width: 130,
    includeInCSVExport: true,
    csvCellValueFormatter: cell => UtcFormatDate(cell.value),
  },
  {
    colId: DIRECTION,
    headerName: 'Direction',
    field: DIRECTION,
    width: 110,
    filterFramework: SetFilter,
    includeInCSVExport: true,
  },
  {
    colId: SYMBOL,
    headerName: 'CCYCCY',
    field: SYMBOL,
    width: 110,
    filterFramework: SetFilter,
    includeInCSVExport: true,
  },
  {
    colId: DEALT_CURRENCY,
    headerName: 'Dealt CCY',
    field: DEALT_CURRENCY,
    width: 90,
    filterFramework: SetFilter,
    includeInCSVExport: true,
  },
  {
    colId: NOTIONAL,
    headerName: 'Notional',
    field: NOTIONAL,
    cellClass: 'rt-blotter__numeric-cell',
    headerClass: 'rt-header__numeric',
    width: 110,
    filter: 'agNumberColumnFilter',
    cellRenderer: ({ data }) => notionalRenderer(data['notional']),
    includeInCSVExport: true,
    csvCellValueFormatter: cell => notionalRenderer(cell.value),
  },
  {
    colId: SPOT_RATE,
    headerName: 'Rate',
    field: SPOT_RATE,
    width: 100,
    cellClass: 'rt-blotter__numeric-cell',
    headerClass: 'rt-header__numeric',
    filter: 'agNumberColumnFilter',
    includeInCSVExport: true,
  },
  {
    colId: VALUE_DATE,
    headerName: 'Value Date',
    field: VALUE_DATE,
    cellRenderer: ({ data }) => UtcFormatDate(data['valueDate']),
    width: 120,
    includeInCSVExport: true,
    csvCellValueFormatter: cell => UtcFormatDate(cell.value),
  },
  {
    colId: TRADER_NAME,
    field: TRADER_NAME,
    headerName: 'Trader',
    width: 110,
    filterFramework: SetFilter,
    includeInCSVExport: true,
  },
  {
    colId: 'empty',
    field: 'empty',
    headerName: '',
    width: 80,
    suppressSizeToFit: false,
    filter: true,
    includeInCSVExport: true,
  },
]

export const csvExportSettings: CsvExportParams = {
  fileName: `RT-Blotter.csv`,
  columnKeys: columnDefinitions.filter(c => c.includeInCSVExport).map(c => c.colId),
  processCellCallback: cell => {
    const colDef = columnDefinitions.find(c => c.colId === cell.column.getColId())
    if (colDef && typeof colDef.csvCellValueFormatter === 'function') {
      return colDef.csvCellValueFormatter(cell)
    }
    return cell.value
  },
}
