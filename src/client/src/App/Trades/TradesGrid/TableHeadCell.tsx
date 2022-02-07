import { useRef, useState } from "react"
import styled from "styled-components"
import { FaFilter, FaLongArrowAltDown, FaLongArrowAltUp } from "react-icons/fa"
import { Subscribe } from "@react-rxjs/core"
import { usePopUpMenu } from "@/utils"
import type {
  ColField,
  NumColField,
  SetColField,
  DateColField,
  SortDirection,
} from "../TradesState"
import {
  onSortFieldSelect,
  colConfigs,
  useTableSort,
  appliedDateFilters$,
  appliedSetFieldFilters$,
  appliedNumFilters$,
} from "../TradesState"
import { SetFilter } from "./SetFilter"
import { NumFilter } from "./NumFilter"
import { DateFilter } from "./DateFilter"

const TableHeadCell = styled.th<{ numeric: boolean; width: number }>`
  text-align: ${({ numeric }) => (numeric ? "right" : "left")};
  ${({ numeric }) => (numeric ? "padding-right: 1.5rem;" : null)};
  width: ${({ width }) => `${width} px`};
  font-weight: unset;
  top: 0;
  position: sticky;
  background-color: ${({ theme }) => theme.core.lightBackground};
  border-bottom: 0.25rem solid ${({ theme }) => theme.core.darkBackground};
  cursor: pointer;
  z-index: 1;

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
`
const FlexWrapper = styled.div<{ headerFirst: boolean }>`
  display: flex;
  flex-direction: ${({ headerFirst }) => (headerFirst ? "row" : "row-reverse")};
`

const AlignedFilterIcon = styled(FaFilter)<{
  "aria-label"?: string
  role?: string
}>`
  margin-top: 0.1rem;
`

const AlignedUpArrow = styled(FaLongArrowAltUp)`
  margin-top: 0.1rem;
`

const AlignedDownArrow = styled(FaLongArrowAltDown)`
  margin-top: 0.1rem;
`

const AlignedArrow: React.FC<{
  sortDirection: SortDirection
  ariaLabel: string
}> = ({ sortDirection, ariaLabel }) =>
  sortDirection === "ASC" ? (
    <AlignedUpArrow role="sort" aria-label={ariaLabel} />
  ) : (
    <AlignedDownArrow role="sort" aria-label={ariaLabel} />
  )

export const TableHeadCellContainer: React.FC<{
  field: ColField
}> = ({ field }) => {
  const [showFilter, setShowFilter] = useState(false)
  const ref = useRef<HTMLTableHeaderCellElement>(null)
  const { displayMenu, setDisplayMenu } = usePopUpMenu(ref)
  const tableSort = useTableSort()
  const { headerName, filterType } = colConfigs[field]

  return (
    <TableHeadCell
      onMouseEnter={() => setShowFilter(true)}
      onMouseLeave={() => setShowFilter(false)}
      numeric={filterType === "number" && field !== "tradeId"}
      width={colConfigs[field].width}
      scope="col"
      ref={ref}
    >
      <FlexWrapper
        onClick={(e) => {
          // Don't trigger sort on events bubbling from FilterPopup
          if (e.target === e.currentTarget) {
            onSortFieldSelect(field)
          }
        }}
        headerFirst={filterType !== "number" || field === "tradeId"}
      >
        {headerName}
        {tableSort.field === field && tableSort.direction !== undefined ? (
          <AlignedArrow
            sortDirection={tableSort.direction}
            ariaLabel={`Update trades blotter sort on ${colConfigs[field].headerName} field`}
          />
        ) : (
          <span className="spacer" aria-hidden={true} />
        )}
        {showFilter ? (
          <AlignedFilterIcon
            aria-label={`Open ${colConfigs[field].headerName} field filter pop up`}
            role="button"
            onClick={() => {
              setDisplayMenu((current) => !current)
            }}
          />
        ) : (
          <span className="spacer" aria-hidden={true} />
        )}
        {displayMenu &&
          (filterType === "number" ? (
            <Subscribe source$={appliedNumFilters$(field as NumColField)}>
              <NumFilter field={field as NumColField} parentRef={ref} />
            </Subscribe>
          ) : filterType === "set" ? (
            <Subscribe source$={appliedSetFieldFilters$(field as SetColField)}>
              <SetFilter field={field as SetColField} parentRef={ref} />
            </Subscribe>
          ) : (
            <Subscribe source$={appliedDateFilters$(field as DateColField)}>
              <DateFilter field={field as DateColField} parentRef={ref} />
            </Subscribe>
          ))}
      </FlexWrapper>
    </TableHeadCell>
  )
}
