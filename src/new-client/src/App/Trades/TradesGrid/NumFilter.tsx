import React from "react"
import styled from "styled-components/macro"
import type { NumColField, NumFilterContent } from "../TradesState"
import {
  ComparatorType,
  onColFilterEnterNum,
  useAppliedNumFilters,
} from "../TradesState"
import { FilterPopup } from "./components/FilterPopup"
import { ComparatorSelect } from "./components/ComparatorSelect"

const FilterValueInputInner = styled.input`
  grid-area: Input;
  background: none;
  text-align: center;
  outline: none;
  border: none;
  font-size: 0.75rem;
  width: 100%;
  padding: 2px 0;
  color: ${({ theme }) => theme.core.textColor};
  border-bottom: 1.5px solid ${({ theme }) => theme.primary[5]};
  caret-color: ${({ theme }) => theme.primary.base};
  &:focus {
    outline: none !important;
    border-color: ${({ theme }) => theme.accents.primary.base};
  }
`

const FilterValueInput: React.FC<{
  field: NumColField
  selected: NumFilterContent
  fieldValueName: "value1" | "value2"
}> = ({ field, selected, fieldValueName }) => (
  <FilterValueInputInner
    defaultValue={selected[fieldValueName] ?? undefined}
    onClick={(e) => e.stopPropagation()}
    onChange={({ target: { value } }) => {
      onColFilterEnterNum(field, {
        ...selected,
        [fieldValueName]: value ? parseInt(value) : null,
      })
    }}
  />
)

export const NumFilter: React.FC<{
  field: NumColField
  parentRef: React.RefObject<HTMLDivElement>
}> = ({ field, parentRef }) => {
  const selected = useAppliedNumFilters(field)
  return (
    <FilterPopup parentRef={parentRef}>
      <ComparatorSelect
        selected={selected}
        onSelection={(comparator: ComparatorType) => {
          onColFilterEnterNum(field, {
            ...selected,
            comparator,
          })
        }}
      />
      <br />
      <FilterValueInput
        field={field}
        selected={selected}
        fieldValueName="value1"
      />
      {selected.comparator === ComparatorType.InRange && (
        <FilterValueInput
          field={field}
          selected={selected}
          fieldValueName="value2"
        />
      )}
    </FilterPopup>
  )
}
