import { bind } from "@react-rxjs/core"
import { createSignal, mergeWithKey } from "@react-rxjs/utils"
import { map, scan, shareReplay, startWith, switchMap } from "rxjs/operators"
import { FxTrade } from "@/services/trades"
import { colConfig$, ColDef } from "../colConfig"
import type { FilterEvent } from "./filterCommon"
import {
  ComparatorType,
  filterResets$,
  initialFilterContent,
} from "./filterCommon"
import { Observable } from "rxjs"

/**
 * Subset of column fields (as values) that take date filters
 */
const extractDateFields = <T extends keyof any>(colConfigs: ColDef): T[] =>
  (Object.keys(colConfigs) as T[]).filter(
    (key: T) => colConfigs[key].filterType === "date",
  )

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

interface DateFilterSet extends FilterEvent {
  value: DateFilterContent
}

const dateFilterDefaults$ = colConfig$.pipe(
  map((config: ColDef) => {
    return extractDateFields(config).reduce((valuesContainer, field) => {
      return {
        ...valuesContainer,
        [field]: initialFilterContent,
      }
    }, {} as Record<keyof any, any>)
  }),
)

/**
 * Stream of date filter events (either selection of new comparator
 * or date value)
 *
 * ToDo - refactor into keyed signal
 */
const [colFilterDateSelects$, onColFilterDateSelect] = createSignal(
  (field: keyof any, value: DateFilterContent) =>
    ({ field, value } as DateFilterSet),
)

export { onColFilterDateSelect }

/**
 * Stream that represents all currently set date
 * filters, keyed by column field.  Updates either
 * on column filter event or when the filter is
 * unset through the TradesHeader.
 */
export const dateFilters$ = dateFilterDefaults$.pipe(
  switchMap((dateFilterDefaults) => {
    return mergeWithKey({
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
      }, dateFilterDefaults),
      startWith(dateFilterDefaults),
      shareReplay(),
    )
  }),
)

/**
 * State hook and parametric stream that emit date
 * filter state.  Used by DateFilter component.
 */
export const [useAppliedDateFilters, appliedDateFilters$] = bind(
  (field: keyof any) =>
    dateFilters$.pipe(map((dateFilters) => dateFilters[field])),
)

/**
 * Construct date filter state stream as entries.
 *
 * Used by date filter predicate to filter trades.
 */
export const dateFilterEntries$ = dateFilters$.pipe(
  map((dateFilters) =>
    Object.entries(dateFilters).filter(
      ([_, valueSet]) => valueSet.value1 !== null,
    ),
  ),
)
