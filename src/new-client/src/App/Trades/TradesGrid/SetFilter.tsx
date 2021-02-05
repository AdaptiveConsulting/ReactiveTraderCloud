import React from "react"
import styled from "styled-components/macro"
import { FaCheck } from "react-icons/fa"
import { createListener } from "@react-rxjs/utils"
import { bind } from "@react-rxjs/core"
import {
  colConfigs,
  SetColField,
  onColFilterToggle,
  distinctFieldValues$,
  onFilterReset,
  useAppliedFieldFilters,
} from "../TradesState"
import { map, startWith } from "rxjs/operators"
import { combineLatest } from "rxjs"

export const MultiSelectWrapper = styled.span`
  position: absolute;
  width: 100%;
  height: 100%;
  background-color: ${({ theme }) => theme.core.lightBackground};
  border-radius: 4px;
  color: ${({ theme }) => theme.core.textColor};
  font-size: 12px;
  padding: 8px 15px 5px 15px;
  cursor: pointer;
  display: inline-block;

  @media (max-width: 400px) {
    display: none;
  }
`

export const MultiSelectMenu = styled.div`
  position: absolute;
  width: calc(fit-content + 1rem);
  min-height: 100%;
  max-height: 8rem;
  overflow-y: scroll;
  top: 0px;
  right: 10px;
  background-color: ${({ theme }) => theme.primary.base};
  padding: 6px;
  box-shadow: ${({ theme }) => theme.core.textColor} 0px 0px 0.3125rem 0px;
`

export const MultiSelectOption = styled.div<{
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

const [searchInputs$, onSearchInput] = createListener<string>()

const [useFilterOptions] = bind(
  (key: SetColField) =>
    combineLatest([
      searchInputs$.pipe(startWith("")),
      distinctFieldValues$(key),
    ]).pipe(
      map(([searchInput, distinctFieldValues]) => {
        const distinctValuesArray = [...distinctFieldValues] as string[]
        if (!searchInput.length) {
          return distinctValuesArray
        } else {
          return distinctValuesArray.filter((fieldValue) =>
            fieldValue.toLowerCase().includes(searchInput.toLowerCase()),
          )
        }
      }),
    ),
  [],
)

export const SetFilter: React.FC<{
  field: SetColField
  parentRef: React.RefObject<HTMLDivElement>
}> = ({ field, parentRef }) => {
  const selected = useAppliedFieldFilters(field) as Set<string>
  const options = useFilterOptions(field)
  const { valueFormatter } = colConfigs[field]
  return (
    <MultiSelectWrapper>
      <MultiSelectMenu ref={parentRef}>
        <SearchInput
          type="text"
          placeholder="Search"
          onChange={(e) => onSearchInput(e.target.value)}
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
        {options.map((option) => {
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
      </MultiSelectMenu>
    </MultiSelectWrapper>
  )
}
