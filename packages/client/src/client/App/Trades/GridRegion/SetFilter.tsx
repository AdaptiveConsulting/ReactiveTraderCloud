import { bind, Subscribe } from "@react-rxjs/core"
import { FaCheck } from "react-icons/fa"
import { filter, map, startWith } from "rxjs/operators"
import styled from "styled-components"

import { Box } from "@/client/components/Box"
import { TextInput } from "@/client/components/Form/TextInput"
import { Typography } from "@/client/components/Typography"

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
  padding: ${({ theme }) => theme.newTheme.spacing.md};
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: ${({ selected, theme }) =>
    selected
      ? theme.newTheme.color["Colors/Background/bg-brand-primary"]
      : "inherit"};
  border-radius: 2px;
  margin-bottom: 5px;

  &:hover {
    background-color: ${({ theme }) =>
      theme.newTheme.color["Colors/Background/bg-brand-primary_alt"]};
  }
`
const AlignedChecked = styled.span`
  margin-left: 0.675rem;
  min-width: 0.675rem;
`

const [useInputText, inputText$] = bind((propsField) =>
  searchInputs$.pipe(
    filter(({ field: eventField }) => propsField === eventField),
    map(({ value }) => value),
    startWith(""),
  ),
)

const SetFilterInner = ({
  field,
  parentRef,
}: {
  field: SetColField
  parentRef: React.RefObject<HTMLDivElement>
}) => {
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
    <FilterPopup
      parentRef={parentRef}
      ariaLabel={`Filter trades by ${field} field value`}
    >
      <Box paddingBottom="sm">
        <TextInput
          value={inputValue}
          placeholder="Search"
          onChange={(e) => onSearchInput(field, e.target.value)}
        />
      </Box>
      <MultiSelectOption
        key={`select-all-filter`}
        onClick={() => {
          if (selected.size > 0) {
            onFilterReset(field)
          }
        }}
        selected={selected.size === 0}
      >
        <Typography
          variant={`Text sm/${selected.size === 0 ? "Bold" : "Regular"}`}
          color="Colors/Text/text-primary (900)"
        >
          Select All
        </Typography>
        <AlignedChecked>{selected.size === 0 && <FaCheck />}</AlignedChecked>
      </MultiSelectOption>
      {[...options].map((option) => {
        const isSelected = selected.has(option)
        return (
          <MultiSelectOption
            key={`${option}-filter`}
            data-testid={`select-option-${option}`}
            onClick={() => onColFilterToggle(field, option)}
            selected={isSelected}
          >
            <Typography
              variant={`Text sm/${isSelected ? "Bold" : "Regular"}`}
              color="Colors/Text/text-primary (900)"
            >
              {valueFormatter?.(option) ?? option}
            </Typography>
            <AlignedChecked>{isSelected && <FaCheck />}</AlignedChecked>
          </MultiSelectOption>
        )
      })}
    </FilterPopup>
  )
}

export const SetFilter = ({
  field,
  parentRef,
}: {
  field: SetColField
  parentRef: React.RefObject<HTMLDivElement>
}) => (
  <Subscribe source$={inputText$(field)}>
    <SetFilterInner field={field} parentRef={parentRef} />
  </Subscribe>
)
