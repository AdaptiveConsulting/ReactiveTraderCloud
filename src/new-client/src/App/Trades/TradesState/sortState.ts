import { scan, startWith } from "rxjs/operators"
import { bind } from "@react-rxjs/core"
import { createListener } from "@react-rxjs/utils"
import type { ColField } from "./colConfig"

export type SortDirection = "ASC" | "DESC"

export class TableSort {
  constructor(public direction?: SortDirection, public field?: ColField) {}
}

export const [
  sortFieldSelections$,
  onSortFieldSelect,
] = createListener<ColField>()

const descDefaultFields = new Set<ColField>([
  "tradeDate",
  "valueDate",
  "tradeId",
])

export const [useTableSort, tableSort$] = bind(
  sortFieldSelections$.pipe(
    scan((tableSort, sortFieldSelection) => {
      if (tableSort.field === sortFieldSelection) {
        if (
          descDefaultFields.has(sortFieldSelection) &&
          tableSort.direction === "DESC"
        ) {
          return new TableSort("ASC", sortFieldSelection)
        } else if (
          !descDefaultFields.has(sortFieldSelection) &&
          tableSort.direction === "ASC"
        ) {
          return new TableSort("DESC", sortFieldSelection)
        } else {
          return new TableSort()
        }
      }

      return new TableSort(
        descDefaultFields.has(sortFieldSelection) ? "DESC" : "ASC",
        sortFieldSelection,
      )
    }, new TableSort()),
    startWith(new TableSort()),
  ),
)
