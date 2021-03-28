import { Trade } from "@/services/trades"
import { map, scan, shareReplay, startWith } from "rxjs/operators"
import { bind } from "@react-rxjs/core"
import { createSignal, mergeWithKey } from "@react-rxjs/utils"
import type { FilterEvent } from "./filterCommon"
import {
  ComparatorType,
  filterResets$,
  initialFilterContent,
} from "./filterCommon"
import { colFields, colConfigs } from "../colConfig"

/**
 * Subset of column fields (as type) that take number filters
 */
export type NumColField = keyof Pick<Trade, "tradeId" | "notional" | "spotRate">

/**
 * Subset of column fields (as values) that take number filters
 */
const numFields = colFields.filter(
  (field) => colConfigs[field].filterType === "number",
)

/**
 * Three components of number filter state
 *
 * comparator
 * - the selected filter operation
 * - is always set
 *
 * value1
 * - the number entered into the primary
 * text input
 * - when no number is set, no filter is applied
 *
 * value2
 * - the number entered into the secondary
 * text input
 * - only relevant when comparator is set to a range
 */
export interface NumFilterContent {
  comparator: ComparatorType
  value1: number | null
  value2?: number | null
}

export type NumFilters = {
  [K in NumColField]: NumFilterContent
}
interface NumFilterSet extends FilterEvent {
  value: NumFilterContent
}

const numFilterDefaults = numFields.reduce((valuesContainer, field) => {
  return {
    ...valuesContainer,
    [field]: initialFilterContent,
  }
}, {} as NumFilters)

/**
 * Stream of number filter events (either selection of new comparator
 * or input of numerical value)
 *
 * ToDo - refactor into keyed signal
 */
const [colFilterNum$, onColFilterEnterNum] = createSignal(
  (field: NumColField, value: NumFilterContent) =>
    ({ field, value } as NumFilterSet),
)

export { onColFilterEnterNum }

/**
 * Stream that represents all currently set number
 * filters, keyed by column field.  Updates either
 * on column filter event or when the filter is
 * unset through the TradesHeader.
 */
export const numberFilters$ = mergeWithKey({
  set: colFilterNum$,
  reset: filterResets$,
}).pipe(
  scan((appliedNumFilters, event) => {
    let newValues: NumFilterContent
    const field = event.payload.field
    if (event.type === "reset") {
      newValues = initialFilterContent
    } else {
      const value = event.payload.value as NumFilterContent
      newValues = value
    }
    return {
      ...appliedNumFilters,
      [field]: newValues,
    }
  }, numFilterDefaults),
  startWith(numFilterDefaults),
  shareReplay(), // persist across mounting/unmounting
)

/**
 * State hook and parametric stream that emit number
 * filter state.  Used by NumFilter component.
 */
export const [
  useAppliedNumFilters,
  appliedNumFilters$,
] = bind((field: NumColField) =>
  numberFilters$.pipe(map((appliedFilters) => appliedFilters[field])),
)

/**
 * Construct number filter state stream as entries.
 *
 * Used by number filter predicate to filter trades.
 */
export const numFilterEntries$ = numberFilters$.pipe(
  map((numberFilters) =>
    Object.entries(numberFilters).filter(
      ([_, valueSet]) => valueSet.value1 !== null,
    ),
  ),
)
