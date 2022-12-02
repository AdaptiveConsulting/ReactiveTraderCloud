import { CreditTrade, FxTrade } from "@/services/trades"
import { bind } from "@react-rxjs/core"
import { createSignal, mergeWithKey } from "@react-rxjs/utils"
import { map, scan, shareReplay, startWith } from "rxjs/operators"
import { ColDef } from "../colConfig"
import type { FilterEvent } from "./filterCommon"
import {
  ComparatorType,
  filterResets$,
  initialFilterContent,
} from "./filterCommon"

/**
 * Subset of column fields (as type) that take date filters
 */
export type DateColField =
  | keyof Pick<FxTrade, "tradeDate" | "valueDate">
  | keyof Pick<CreditTrade, "tradeDate">

/**
 * Subset of column fields (as values) that take date filters
 */
const extractDateFields = (colDef: ColDef) =>
  Object.keys(colDef).filter((key) => colDef[key].filterType === "date")

/**
 * Three components of date filter state
 *
 * comparator
 * - the selected filter operation
 * - is always set
 *
 * value1
 * - the date selected in the primary input
 * - when no date is selected, no filter is applied
 *
 * value2
 * - the date selected in the secondary input
 * - only relevant when comparator is set to a range
 */
export interface DateFilterContent {
  comparator: ComparatorType
  value1: Date | null
  value2?: Date | null
}

export type DateFilters = {
  [K in DateColField]: DateFilterContent
}

interface DateFilterSet extends FilterEvent {
  value: DateFilterContent
}

const getDateFilterDefaults = (colDef: ColDef) => {
  return extractDateFields(colDef).reduce((valuesContainer, field) => {
    return {
      ...valuesContainer,
      [field]: initialFilterContent,
    }
  }, {} as DateFilters)
}

/**
 * Stream of date filter events (either selection of new comparator
 * or date value)
 *
 * ToDo - refactor into keyed signal
 */
const [colFilterDateSelects$, onColFilterDateSelect] = createSignal(
  (field: DateColField, value: DateFilterContent) =>
    ({ field, value } as DateFilterSet),
)

export { onColFilterDateSelect }

/**
 * Stream that represents all currently set date
 * filters, keyed by column field.  Updates either
 * on column filter event or when the filter is
 * unset through the TradesHeader.
 */
export const getDateFilters = (colDef: ColDef) =>
  mergeWithKey({
    set: colFilterDateSelects$,
    reset: filterResets$,
  }).pipe(
    scan((appliedDateFilters, event) => {
      let newValues: DateFilterContent
      const field = event.payload.field
      if (event.type === "reset") {
        newValues = initialFilterContent
      } else {
        const value = event.payload.value as DateFilterContent
        newValues = value
      }
      return {
        ...appliedDateFilters,
        [field]: newValues,
      }
    }, getDateFilterDefaults(colDef)),
    startWith(getDateFilterDefaults(colDef)),
    shareReplay(),
  )

/**
 * State hook and parametric stream that emit date
 * filter state.  Used by DateFilter component.
 */
export const [useAppliedDateFilters, appliedDateFilters$] = bind(
  (field: DateColField, colDef: ColDef) =>
    getDateFilters(colDef).pipe(map((dateFilters) => dateFilters[field])),
)

/**
 * Construct date filter state stream as entries.
 *
 * Used by date filter predicate to filter trades.
 */
export const getDateFilterEntries = (colDef: ColDef) =>
  getDateFilters(colDef).pipe(
    map((dateFilters) =>
      Object.entries(dateFilters).filter(
        ([, valueSet]) => valueSet.value1 !== null,
      ),
    ),
  )
