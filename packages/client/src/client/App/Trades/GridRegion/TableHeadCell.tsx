import { useRef, useState } from "react"
import styled from "styled-components"

import { ArrowDownIcon } from "@/client/components/icons/ArrowDownIcon"
import { ArrowUpIcon } from "@/client/components/icons/ArrowUpIcon"
import { FilterIcon } from "@/client/components/icons/FilterIcon"
import { usePopUpMenu } from "@/client/utils"

import { useColDef } from "../Context"
import { useTableSort } from "../TradesState"
import { CreditColField, FxColField } from "../TradesState/colConfig"
import { DateColField } from "../TradesState/filterState/dateFilterState"
import { NumColField } from "../TradesState/filterState/numFilterState"
import { SetColField } from "../TradesState/filterState/setFilterState"
import { onSortFieldSelect } from "../TradesState/sortState"
import { DateFilter } from "./DateFilter"
import { NumFilter } from "./NumFilter"
import { SetFilter } from "./SetFilter"
import { getWidthPercentage } from "./utils"

const TableHeadCell = styled.div<{
  width: number
  isLast: boolean
  headerFirst: boolean
  numeric: boolean
}>`
  width: ${({ width }) => width}%;
  cursor: pointer;
  display: flex;
  flex-direction: ${({ headerFirst }) => (headerFirst ? "row" : "row-reverse")};
  align-items: center;
  text-wrap: nowrap;
  padding-right: ${({ numeric }) => (numeric ? "1.3rem;" : null)};

  svg {
    width: 0.675rem;
    vertical-align: text-bottom;
  }

  span.spacer {
    min-width: 0.675rem;
    display: inline-block;
  }

  span.spacer-2 {
    min-width: 1rem;
    display: inline-block;
  }

  .popup {
    float: ${({ isLast }) => (isLast ? "right" : undefined)};
    margin-right: 0.4rem;
  }
`

interface Props<T extends FxColField | CreditColField> {
  field: T
  isLast: boolean
}

export const TableHeadCellContainer = <T extends FxColField | CreditColField>({
  field,
  isLast,
}: Props<T>) => {
  const [showFilter, setShowFilter] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const { displayMenu, setDisplayMenu } = usePopUpMenu(ref)
  const tableSort = useTableSort()
  const colDef = useColDef()
  const { headerName, filterType, width } = colDef[field]
  const widthPercentage = getWidthPercentage(
    Object.values(colDef).map((value) => value.width),
    width,
  )
  return (
    <TableHeadCell
      onMouseEnter={() => setShowFilter(true)}
      onMouseLeave={() => setShowFilter(false)}
      width={widthPercentage}
      isLast={isLast}
      numeric={filterType === "number" && field !== "tradeId"}
      headerFirst={filterType !== "number" || field === "tradeId"}
      onClick={(e) => {
        // Don't trigger sort on events bubbling from FilterPopup
        if (e.target === e.currentTarget) {
          onSortFieldSelect(field)
        }
      }}
      ref={ref}
    >
      {headerName}
      {tableSort.field === field && tableSort.direction !== undefined ? (
        <div
          role="sort"
          aria-label={`Update trades blotter sort on ${headerName} field`}
        >
          {tableSort.direction === "ASC" ? ArrowUpIcon : ArrowDownIcon}
        </div>
      ) : (
        <span className="spacer" aria-hidden={true} />
      )}
      {showFilter ? (
        <div
          aria-label={`Open ${headerName} field filter pop up`}
          role="button"
          onClick={() => {
            setDisplayMenu((current) => !current)
          }}
        >
          {FilterIcon}
        </div>
      ) : (
        <span className="spacer" aria-hidden={true} />
      )}
      {displayMenu &&
        (filterType === "number" ? (
          <NumFilter field={field as NumColField} parentRef={ref} />
        ) : filterType === "set" ? (
          <SetFilter field={field as SetColField} parentRef={ref} />
        ) : (
          <DateFilter field={field as DateColField} parentRef={ref} />
        ))}
    </TableHeadCell>
  )
}
