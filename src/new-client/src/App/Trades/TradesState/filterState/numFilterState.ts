import { Trade } from "services/trades"
import { map, scan, shareReplay, startWith } from "rxjs/operators"
import { bind } from "@react-rxjs/core"
import { createListener, mergeWithKey } from "@react-rxjs/utils"
import type { FilterEvent } from "./filterCommon"
import {
  ComparatorType,
  filterResets$,
  initialFilterContent,
} from "./filterCommon"
import { colFields, colConfigs } from "../colConfig"

export type NumColField = keyof Pick<Trade, "tradeId" | "notional" | "spotRate">
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

const numFields = colFields.filter(
  (field) => colConfigs[field].filterType === "number",
)

export const fieldNumContainer = numFields.reduce((valuesContainer, field) => {
  return {
    ...valuesContainer,
    [field]: initialFilterContent,
  }
}, {} as NumFilters)

export const [colFilterNum$, onColFilterEnterNum] = createListener(
  (field: NumColField, value: NumFilterContent) =>
    ({ field, value } as NumFilterSet),
)

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
  }, fieldNumContainer),
  startWith(fieldNumContainer),
  shareReplay(),
)

export const [
  useAppliedNumFilters,
  appliedNumFilters$,
] = bind((field: NumColField) =>
  numberFilters$.pipe(map((appliedFilters) => appliedFilters[field])),
)

export const [useNumFilterEntries, numFilterEntries$] = bind(
  numberFilters$.pipe(
    map((numberFilters) =>
      Object.entries(numberFilters).filter(
        ([_, valueSet]) => valueSet.value1 !== null,
      ),
    ),
  ),
  [],
)
