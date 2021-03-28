import { scan, startWith } from "rxjs/operators"
import { bind } from "@react-rxjs/core"
import { createSignal } from "@react-rxjs/utils"
import type { ColField } from "./colConfig"

export type SortDirection = "ASC" | "DESC"

export class TableSort {
  constructor(public direction?: SortDirection, public field?: ColField) {}
}

/**
 * Handles a new sort selection.
 *
 * The signal is very dumb.  Just passes the identifier
 * of the column the user is looking to set/unset sorting
 * on.  The tableSort$ stream--that consumes this signal
 * actually tracks the state of the sorting (ASC, DESC, unset)
 * on the column.
 */
export const [
  sortFieldSelections$,
  onSortFieldSelect,
] = createSignal<ColField>()

/**
 * Default sorting direction is ASC.
 *
 * Exceptions are configured in this set.
 */
const descDefaultFields = new Set<ColField>([
  "tradeDate",
  "valueDate",
  "tradeId",
])

/**
 * The user can sort on a column, ASC or DESC,
 * or remove sort.  The sort directions are advanced
 * progressively by clicking on the column header
 * or by moving to a new column.
 *
 * The directions are 1) Undefined 2) ASC 3) DESC
 *
 * Fields are that are descending by default flip 2)
 * and 3)
 */
export const [useTableSort, tableSort$] = bind(
  sortFieldSelections$.pipe(
    scan((tableSort, sortFieldSelection) => {
      // User is cycling through sort direction on a column
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

      // User is sorting on a new column
      return new TableSort(
        descDefaultFields.has(sortFieldSelection) ? "DESC" : "ASC",
        sortFieldSelection,
      )
    }, new TableSort()),
    startWith(new TableSort()),
  ),
)
