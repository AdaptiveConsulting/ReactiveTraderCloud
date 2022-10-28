import { bind, Subscribe } from "@react-rxjs/core"
import { FaCheck } from "react-icons/fa"
import { filter, map, startWith } from "rxjs/operators"
import styled from "styled-components"
import { useColDef, useTrades$ } from "../Context"
import {
  onColFilterToggle,
  onFilterReset,
  useAppliedSetFieldFilters,
  useDistinctSetFieldValues,
} from "../TradesState"
import { onSearchInput, searchInputs$ } from "../TradesState/filterState"
import { SetColField } from "../TradesState/filterState/setFilterState"
import { FilterPopup } from "./components/FilterPopup"

const MultiSelectOption = styled.div<{
  selected: boolean
  children: React.ReactNode
}>`
  padding: 8px 8px 5px 8px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-weight: ${({ selected }) => (selected ? "bold" : "normal")};
  background-color: ${({ selected, theme }) =>
    selected ? theme.core.activeColor : "inherit"};
  border-radius: 2px;
  margin-bottom: 5px;

  &:hover {
    background-color: ${({ theme }) => theme.core.backgroundHoverColor};
    font-weight: ${({ selected }) => (selected ? "bold" : "normal")};
    text-decoration: underline;
  }
`
const AlignedChecked = styled.span`
  margin-left: 0.675rem;
  min-width: 0.675rem;
`
const SearchInput = styled.input`
  font-size: 0.6875;
  padding: 8px 8px 5px 8px;
  border: none;
  color: ${({ theme }) => theme.core.textColor};
  border-bottom: 0.0625rem solid ${({ theme }) => theme.core.dividerColor};
  outline: none;

  &:focus {
    color: ${({ theme }) => theme.core.activeColor};
    border-bottom: 0.0625rem solid ${({ theme }) => theme.core.activeColor};
  }
`
const [useInputText, inputText$] = bind((propsField) =>
  searchInputs$.pipe(
    filter(({ field: eventField }) => propsField === eventField),
    map(({ value }) => value),
    startWith(""),
  ),
)

const SetFilterInner: React.FC<{
  field: SetColField
  parentRef: React.RefObject<HTMLDivElement>
}> = ({ field, parentRef }) => {
  const colDef = useColDef()
  const trades$ = useTrades$()
  const selected = useAppliedSetFieldFilters(
    field,
    trades$,
    colDef,
  ) as Set<string>
  const options = useDistinctSetFieldValues(
    field,
    trades$,
    colDef,
  ) as Set<string>
  const inputValue = useInputText(field)
  const { valueFormatter } = colDef[field]

  return (
    <FilterPopup parentRef={parentRef}>
      <SearchInput
        type="text"
        placeholder="Search"
        value={inputValue}
        onChange={(e) => onSearchInput(field, e.target.value)}
      />
      <MultiSelectOption
        key={`select-all-filter`}
        onClick={() => {
          if (selected.size > 0) {
            onFilterReset(field)
          }
        }}
        selected={selected.size === 0}
      >
        Select All
        <AlignedChecked>{selected.size === 0 && <FaCheck />}</AlignedChecked>
      </MultiSelectOption>
      {[...options].map((option) => {
        const isSelected = selected.has(option)
        return (
          <MultiSelectOption
            key={`${option}-filter`}
            onClick={() => onColFilterToggle(field, option)}
            selected={isSelected}
          >
            {valueFormatter?.(option) ?? option}
            <AlignedChecked>{isSelected && <FaCheck />}</AlignedChecked>
          </MultiSelectOption>
        )
      })}
    </FilterPopup>
  )
}

export const SetFilter: React.FC<{
  field: SetColField
  parentRef: React.RefObject<HTMLDivElement>
}> = ({ field, parentRef }) => (
  <Subscribe source$={inputText$(field)}>
    <SetFilterInner field={field} parentRef={parentRef} />
  </Subscribe>
)
