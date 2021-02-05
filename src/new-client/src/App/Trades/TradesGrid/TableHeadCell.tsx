import styled from "styled-components/macro"
import { FaFilter, FaLongArrowAltDown, FaLongArrowAltUp } from "react-icons/fa"
import {
  onSortFieldSelect,
  colConfigs,
  ColField,
  useTableSort,
  appliedFieldFilters$,
} from "../TradesState"
import { SetFilter } from "./SetFilter"
import { NumFilter } from "./NumFilter"
import { useRef, useState } from "react"
import { usePopUpMenu } from "utils"
import { Subscribe } from "@react-rxjs/core"
import { NumColField, SetColField } from "../TradesState/colConfig"

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
const AlignedFilterIcon = styled(FaFilter)`
  margin-left: 0.2rem;
  margin-right: 0.1rem;
`

export const TableHeadCellContainer: React.FC<{
  field: ColField
}> = ({ field }) => {
  const [showFilter, setShowFilter] = useState(false)
  const ref = useRef<HTMLTableHeaderCellElement>(null)
  const { displayMenu, setDisplayMenu } = usePopUpMenu(ref)
  const tableSort = useTableSort()
  const { headerName, filterType } = colConfigs[field]
  const numeric = filterType === "number"

  return (
    <TableHeadCell
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onSortFieldSelect(field)
        }
      }}
      onMouseEnter={() => setShowFilter(true)}
      onMouseLeave={() => setShowFilter(false)}
      numeric={numeric && field !== "tradeId"}
      width={colConfigs[field].width}
      ref={ref}
    >
      {numeric ? (
        <>
          {showFilter ? (
            <AlignedFilterIcon
              onClick={(e) => {
                e.stopPropagation()
                setDisplayMenu((current) => !current)
              }}
            />
          ) : (
            <span className="spacer" />
          )}
          {tableSort.direction === "ASC" ? (
            <FaLongArrowAltUp />
          ) : (
            <FaLongArrowAltDown />
          )}
          {headerName}
          {displayMenu && (
            <Subscribe source$={appliedFieldFilters$(field as any)}>
              <NumFilter field={field as NumColField} parentRef={ref} />
            </Subscribe>
          )}
        </>
      ) : (
        <>
          {headerName}
          {tableSort.field === field ? (
            tableSort.direction === "ASC" ? (
              <FaLongArrowAltUp />
            ) : (
              <FaLongArrowAltDown />
            )
          ) : (
            <span className="spacer" />
          )}
          {showFilter ? (
            <FaFilter
              onClick={(e) => {
                e.stopPropagation()
                setDisplayMenu((current) => !current)
              }}
            />
          ) : (
            <span className="spacer" />
          )}
          {displayMenu && (
            <Subscribe source$={appliedFieldFilters$(field as SetColField)}>
              <SetFilter field={field as SetColField} parentRef={ref} />
            </Subscribe>
          )}
        </>
      )}
    </TableHeadCell>
  )
}
