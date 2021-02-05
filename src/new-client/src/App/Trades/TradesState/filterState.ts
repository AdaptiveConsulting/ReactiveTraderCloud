import { bind } from "@react-rxjs/core"
import { map, scan, shareReplay, startWith } from "rxjs/operators"
import { mapObject } from "utils"
import { Trade, trades$ } from "services/trades"
import { ColField, colFields, NumColField, SetColField } from "./colConfig"
import { createListener, mergeWithKey } from "@react-rxjs/utils"

export enum ComparatorType {
  Equals = "Equals",
  NotEqual = "Not equal",
  Less = "Less than",
  LessOrEqual = "Less than or equals",
  Greater = "Greater than",
  GreaterOrEqual = "Greater than or equals",
  InRange = "In range",
}

export interface NumFilterContent {
  comparator: ComparatorType
  value1: number | null
  value2?: number | null
}

export type NumFilters = {
  [K in NumColField]: NumFilterContent
}

const initialNumFilter: NumFilterContent = {
  comparator: ComparatorType.Equals,
  value1: null,
  value2: null,
}

export const fieldNumContainer = colFields.reduce((valuesContainer, field) => {
  return {
    ...valuesContainer,
    [field]: initialNumFilter,
  }
}, {} as NumFilters)

export type DistinctValues = {
  [K in SetColField]: Set<Trade[K]>
}

export const fieldValuesContainer = Object.freeze(
  colFields.reduce((valuesContainer, field) => {
    return {
      ...valuesContainer,
      [field]: new Set(),
    }
  }, {} as DistinctValues),
)

const ClonedFieldValuesContainer = () =>
  mapObject(fieldValuesContainer, () => new Set()) as DistinctValues

const distinctValues$ = trades$.pipe(
  map((trades) =>
    trades.reduce((distinctValues, trade) => {
      for (const field in trade) {
        ;(distinctValues[field as SetColField] as Set<unknown>).add(
          trade[field as SetColField],
        )
      }
      return distinctValues
    }, ClonedFieldValuesContainer()),
  ),
)

export const [_, distinctFieldValues$] = bind(
  (field: SetColField) =>
    distinctValues$.pipe(map((distinctValues) => distinctValues[field])),
  new Set(),
)

interface FilterEvent {
  field: ColField
}

interface ColFieldToggle extends FilterEvent {
  value: unknown
}

interface NumFilterSet extends FilterEvent {
  value: NumFilterContent
}

export const [colFilterToggle$, onColFilterToggle] = createListener(
  (field: SetColField, value: unknown) => ({ field, value } as ColFieldToggle),
)

export const [filterResets$, onFilterReset] = createListener(
  (field: ColField) => ({ field } as FilterEvent),
)

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
      newValues = initialNumFilter
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
)

export const [useAppliedNumFilters] = bind(
  (field: NumColField) =>
    numberFilters$.pipe(map((appliedFilters) => appliedFilters[field])),
  initialNumFilter,
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

const appliedFilters$ = mergeWithKey({
  toggle: colFilterToggle$,
  reset: filterResets$,
}).pipe(
  scan((appliedFilters, event) => {
    let newValues: Set<unknown>
    const field = event.payload.field
    if (event.type === "reset") {
      newValues = new Set()
    } else {
      newValues = new Set(
        appliedFilters[field as SetColField] as Iterable<string>,
      )
      const value = event.payload.value as any
      if (newValues.has(value)) {
        newValues.delete(value)
      } else {
        newValues.add(value)
      }
    }
    return {
      ...appliedFilters,
      [field]: newValues,
    }
  }, ClonedFieldValuesContainer()),
  startWith(ClonedFieldValuesContainer()),
  shareReplay(),
)

export const [
  useAppliedFieldFilters,
  appliedFieldFilters$,
] = bind((field: SetColField) =>
  appliedFilters$.pipe(map((appliedFilters) => appliedFilters[field])),
)

export const [quickFilterInputs$, onQuickFilterInput] = createListener<string>()

export const [useAppliedFilterEntries, appliedFilterEntries$] = bind(
  appliedFilters$.pipe(
    map((appliedFilters) =>
      Object.entries(appliedFilters).filter(
        ([_, valueSet]) => valueSet.size !== 0,
      ),
    ),
  ),
  [],
)
