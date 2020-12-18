import { FilterChangedEvent, GridApi } from "ag-grid-community"
import { Subject } from "rxjs"
import { take } from "rxjs/operators"
import { bind } from "@react-rxjs/core"

export enum COL_FIELD {
  STATUS_INDICATOR = "statusIndicator",
  TRADE_ID = "tradeId",
  STATUS = "status",
  TRADE_DATE = "tradeDate",
  DIRECTION = "direction",
  SYMBOL = "symbol",
  DEALT_CURRENCY = "dealtCurrency",
  NOTIONAL = "notional",
  SPOT_RATE = "spotRate",
  VALUE_DATE = "valueDate",
  TRADER_NAME = "traderName",
  EMPTY = "empty",
}

export const gridApiSubj$ = new Subject<GridApi>()
export const [useGridApi, gridApi$] = bind(gridApiSubj$.pipe(take(1)))

export const CSV_COL_FIELDS = Object.values(COL_FIELD).filter(
  (field) => field !== COL_FIELD.EMPTY && field !== COL_FIELD.STATUS_INDICATOR,
)

export const filterChangesSubj$ = new Subject<FilterChangedEvent>()
export const [useFilterChanges, filterChanges$] = bind(filterChangesSubj$)
