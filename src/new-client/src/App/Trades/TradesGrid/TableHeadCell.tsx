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
import { useRef, useState, useEffect } from "react"
import { usePopUpMenu } from "utils"
import { Subscribe } from "@react-rxjs/core"
import { useAppliedNumFilters } from "../TradesState/filterState"
import Popup from "components/Popup"
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

export const ContactUsPopup = styled(Popup)`
  box-shadow: 0 7px 26px 0 rgba(23, 24, 25, 0.5);
  bottom: calc(2rem + 0.25rem);
  border-radius: 0.5rem;
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
  const [comparator, setComparator] = useState("Equals")
  const value1 = useRef<string | null>(null)
  const value2 = useRef<string | null>(null)
  const selected = useAppliedNumFilters(field as NumColField)

  useEffect(() => {
    setComparator(selected.comparator)
    if (selected.value1) {
      value1.current = selected.value1.toString()
    } else {
      value1.current = null
    }
    if (selected.value2) {
      value2.current = selected.value2.toString()
    } else {
      value2.current = null
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selected])
  return (
    <TableHeadCell
      onClick={() => onSortFieldSelect(field)}
      onMouseEnter={() => setShowFilter(true)}
      onMouseLeave={() => setShowFilter(false)}
      numeric={numeric && field !== "tradeId"}
      width={colConfigs[field].width}
      ref={ref}
    >
      {displayMenu &&
        (numeric ? (
          <NumFilter
            field={field as NumColField}
            comparator={comparator}
            setComparator={setComparator}
            value1={value1}
            value2={value2}
          />
        ) : (
          <Subscribe source$={appliedFieldFilters$(field as SetColField)}>
            <SetFilter field={field as SetColField} parentRef={ref} />
          </Subscribe>
        ))}
      {numeric &&
        field !== "tradeId" &&
        (showFilter ? (
          <AlignedFilterIcon
            onClick={(e) => {
              e.stopPropagation()
              setDisplayMenu((current) => !current)
            }}
          />
        ) : (
          <span className="spacer" />
        ))}
      {tableSort.field === field && numeric && field !== "tradeId" ? (
        tableSort.direction === "ASC" ? (
          <FaLongArrowAltUp />
        ) : (
          <FaLongArrowAltDown />
        )
      ) : null}
      {headerName}
      {tableSort.field === field && (!numeric || field === "tradeId") ? (
        tableSort.direction === "ASC" ? (
          <FaLongArrowAltUp />
        ) : (
          <FaLongArrowAltDown />
        )
      ) : null}
      {(!numeric || field === "tradeId") &&
        (showFilter ? (
          <AlignedFilterIcon
            onClick={(e) => {
              e.stopPropagation()
              setDisplayMenu((current) => !current)
            }}
          />
        ) : (
          <span className="spacer" />
        ))}
    </TableHeadCell>
  )
}
