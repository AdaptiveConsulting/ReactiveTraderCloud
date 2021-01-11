import { bind } from "@react-rxjs/core"
import { map, scan, startWith } from "rxjs/operators"
import { mapObject } from "utils"
import { Trade, trades$ } from "services/trades"
import { ColField, colFields } from "./colConfig"
import { createListener } from "@react-rxjs/utils"

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

export const [useDistinctFieldValues, distinctFieldValues$] = bind(
  trades$.pipe(
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
  ),
)

export const [colFilterSelections$, onColFilterSelect] = createListener<
  [ColField, Set<unknown>]
>()

export const [useAppliedFilters, appliedFilters$] = bind(
  colFilterSelections$.pipe(
    scan((appliedFilters, [field, filterSet]) => {
      return {
        ...appliedFilters,
        [field]: filterSet,
      }
    }, ClonedFieldValuesContainer()),
    startWith(ClonedFieldValuesContainer()),
  ),
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
