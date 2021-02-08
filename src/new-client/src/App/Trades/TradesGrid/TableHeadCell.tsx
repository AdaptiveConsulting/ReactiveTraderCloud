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
import { useRef, useState } from "react"
import { usePopUpMenu } from "utils"
import { Subscribe } from "@react-rxjs/core"

const TableHeadCell = styled.th`
  text-align: left;
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

export const TableHeadCellContainer: React.FC<{
  field: ColField
}> = ({ field }) => {
  const [showFilter, setShowFilter] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const { displayMenu, setDisplayMenu } = usePopUpMenu(ref)
  const tableSort = useTableSort()
  const { headerName, filterType } = colConfigs[field]
  return (
    <TableHeadCell
      onClick={() => onSortFieldSelect(field)}
      onMouseEnter={() => filterType === "set" && setShowFilter(true)}
      onMouseLeave={() => setShowFilter(false)}
    >
      {displayMenu && (
        <Subscribe source$={appliedFieldFilters$(field)}>
          <SetFilter field={field} parentRef={ref} />
        </Subscribe>
      )}
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
    </TableHeadCell>
  )
}
