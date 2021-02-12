import { bind } from "@react-rxjs/core"
import { createListener, mergeWithKey } from "@react-rxjs/utils"
import { map, scan, shareReplay, startWith } from "rxjs/operators"
import { Trade } from "services/trades"
import { colConfigs, colFields } from "../colConfig"
import type { FilterEvent } from "./filterCommon"
import {
  ComparatorType,
  filterResets$,
  initialFilterContent,
} from "./filterCommon"

export type DateColField = keyof Pick<Trade, "tradeDate" | "valueDate">

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
const dateFields = colFields.filter(
  (field) => colConfigs[field].filterType === "date",
)

export const fieldDDateContainer = dateFields.reduce(
  (valuesContainer, field) => {
    return {
      ...valuesContainer,
      [field]: initialFilterContent,
    }
  },
  {} as DateFilters,
)

export const [colFilterDateSelects$, onColFilterDateSelect] = createListener(
  (field: DateColField, value: DateFilterContent) =>
    ({ field, value } as DateFilterSet),
)

export const dateFilters$ = mergeWithKey({
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
  }, fieldDDateContainer),
  startWith(fieldDDateContainer),
  shareReplay(),
)

export const [
  useAppliedDateFilters,
  appliedDateFilters$,
] = bind((field: DateColField) =>
  dateFilters$.pipe(map((dateFilters) => dateFilters[field])),
)

export const [useDateFilterEntries, dateFilterEntries$] = bind(
  dateFilters$.pipe(
    map((dateFilters) =>
      Object.entries(dateFilters).filter(
        ([_, valueSet]) => valueSet.value1 !== null,
      ),
    ),
  ),
  [],
)
