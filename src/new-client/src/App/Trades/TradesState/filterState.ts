import { bind } from "@react-rxjs/core"
import { map, scan, startWith } from "rxjs/operators"
import { mapObject } from "utils"
import { Trade, trades$ } from "services/trades"
import { ColField, colFields } from "./colConfig"
import { createListener, mergeWithKey } from "@react-rxjs/utils"

export type DistinctValues = {
  [K in ColField]: Set<Trade[K]>
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
        ;(distinctValues[field as keyof Trade] as Set<unknown>).add(
          trade[field as keyof Trade],
        )
      }
      return distinctValues
    }, ClonedFieldValuesContainer()),
  ),
)

export const [_, distinctFieldValues$] = bind(
  (field: ColField) =>
    distinctValues$.pipe(map((distinctValues) => distinctValues[field])),
  new Set(),
)

interface FilterEvent {
  field: ColField
}

interface ColFieldToggle extends FilterEvent {
  value: unknown
}
export const [colFilterToggle$, onColFilterToggle] = createListener(
  (field: ColField, value: unknown) => ({ field, value } as ColFieldToggle),
)

export const [filterResets$, onFilterReset] = createListener(
  (field: ColField) => ({ field } as FilterEvent),
)

const appliedFilters$ = mergeWithKey({
  toggle: colFilterToggle$,
  reset: filterResets$,
}).pipe(
  scan((appliedFilters, event) => {
    let newValues: Set<unknown>
    const field: ColField = event.payload.field
    if (event.type === "reset") {
      newValues = new Set()
    } else {
      newValues = new Set(appliedFilters[field] as Iterable<string>)
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
)

export const [useAppliedFieldFilters] = bind(
  (field: ColField) =>
    appliedFilters$.pipe(map((appliedFilters) => appliedFilters[field])),
  new Set(),
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
