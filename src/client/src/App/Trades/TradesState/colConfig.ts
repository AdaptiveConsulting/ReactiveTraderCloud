import type { Trade } from "@/services/trades"
import { format as formatDate } from "date-fns"
import {
  significantDigitsNumberFormatter,
  formatAsWholeNumber,
  capitalize,
  THOUSANDS_SEPARATOR,
} from "@/utils"

export type ColField = keyof Trade

export type FilterType = "set" | "date" | "number"

type ValueFormatter = (val: unknown) => string

/**
 * All of these values are configured centrally because
 * they are used together in multiple places:
 *
 * grid body, grid header, grid export
 *
 * headerName - display name for the column field / trade key
 * filterType - type of filter predicate that applies to the column
 * valueFormatter - how to display the field values in the column
 * excelValueFormatter - if defined, overwrites valueFormatter when exporting to Excel/CSV
 * width - needed to keep header/body cells same width
 */
export interface ColConfig {
  headerName: string
  filterType: FilterType
  valueFormatter?: ValueFormatter
  excelValueFormatter?: ValueFormatter
  width: number
}

export const DATE_FORMAT = "dd-MMM-yyyy"

const formatTo6Digits = significantDigitsNumberFormatter(6)

const notionalExcelValueFormatter: ValueFormatter = (v) =>
  formatAsWholeNumber(v as number).replaceAll(THOUSANDS_SEPARATOR, "")

export const colConfigs: Record<ColField, ColConfig> = {
  tradeId: {
    headerName: "Trade ID",
    filterType: "number",
    width: 100,
  },
  status: {
    headerName: "Status",
    filterType: "set",
    valueFormatter: capitalize,
    width: 110,
  },
  tradeDate: {
    headerName: "Trade Date",
    filterType: "date",
    valueFormatter: (v) => formatDate(v as Date, DATE_FORMAT),
    width: 130,
  },
  direction: {
    headerName: "Direction",
    filterType: "set",
    width: 110,
  },
  symbol: {
    headerName: "CCYCCY",
    filterType: "set",
    width: 110,
  },
  dealtCurrency: {
    headerName: "Deal CCY",
    filterType: "set",
    width: 90,
  },
  notional: {
    headerName: "Notional",
    filterType: "number",
    valueFormatter: (v) => formatAsWholeNumber(v as number),
    excelValueFormatter: notionalExcelValueFormatter,
    width: 120,
  },
  spotRate: {
    headerName: "Rate",
    filterType: "number",
    valueFormatter: (v) => formatTo6Digits(v as number),
    width: 100,
  },
  valueDate: {
    headerName: "Value Date",
    filterType: "date",
    valueFormatter: (v) => formatDate(v as Date, DATE_FORMAT),
    width: 120,
  },
  traderName: {
    headerName: "Trader",
    filterType: "set",
    width: 110,
  },
}

/**
 * Values of the Trade keys.  Used for dynamically constructing maps that
 * concern each key.
 */
export const colFields: ColField[] = Object.keys(colConfigs) as ColField[]
