import { bind } from "@react-rxjs/core"
import { map, scan, startWith } from "rxjs/operators"
import { mapObject } from "utils"
import { Trade, trades$ } from "services/trades"
import { ColField, colFields } from "./colConfig"
import { createListener } from "@react-rxjs/utils"
import { merge } from "rxjs"

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

export const [useDistinctFieldValues, distinctFieldValues$] = bind(
  (field: ColField) =>
    distinctValues$.pipe(map((distinctValues) => distinctValues[field])),
  new Set(),
)

abstract class FilterEvent {
  constructor(public colField: ColField) {}
}
export class ColFieldToggle extends FilterEvent {
  constructor(
    colField: ColField,
    public fieldValue: unknown,
    public set: boolean,
  ) {
    super(colField)
  }
}

export const [
  colFilterToggle$,
  onColFilterToggle,
] = createListener<ColFieldToggle>()

export class FilterReset extends FilterEvent {}

export const [filterResets$, onFilterReset] = createListener<FilterReset>()

const appliedFilters$ = merge(colFilterToggle$, filterResets$).pipe(
  scan((appliedFilters, nextFilterEvent) => {
    let newValues: Set<unknown>
    let field: ColField = nextFilterEvent.colField

    if (nextFilterEvent instanceof FilterReset) {
      newValues = new Set()
    } else if (nextFilterEvent instanceof ColFieldToggle) {
      newValues = new Set(appliedFilters[field] as Iterable<string>)
      newValues[nextFilterEvent.set ? "add" : "delete"](
        nextFilterEvent.fieldValue,
      )
    } else {
      throw new Error(`Unexpected FilterEvent: ${nextFilterEvent}`)
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
