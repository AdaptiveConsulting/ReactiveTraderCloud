import styled from "styled-components"

import { useColDef } from "../Context"
import {
  ComparatorType,
  NumFilterContent,
  onColFilterEnterNum,
  useAppliedNumFilters,
} from "../TradesState"
import { NumColField } from "../TradesState/filterState/numFilterState"
import { ComparatorSelect } from "./components/ComparatorSelect"
import { FilterPopup } from "./components/FilterPopup"

const FilterValueInputInner = styled.input`
  grid-area: Input;
  background: none;
  outline: none;
  border: none;
  font-size: 0.75rem;
  width: 100%;
  padding: 2px 10px;
  color: ${({ theme }) =>
    theme.newTheme.color["Colors/Text/text-primary (900)"]};
  border-bottom: 1.5px solid
    ${({ theme }) => theme.newTheme.color["Colors/Border/border-primary"]};
  caret-color: ${({ theme }) =>
    theme.newTheme.color["Colors/Border/border-brand"]};
  &:focus {
    outline: none !important;
    border-color: ${({ theme }) =>
      theme.newTheme.color["Colors/Border/border-brand"]};
  }
`

const FilterValueInput = ({
  field,
  selected,
  fieldValueName,
}: {
  field: NumColField
  selected: NumFilterContent
  fieldValueName: "value1" | "value2"
}) => (
  <FilterValueInputInner
    placeholder="Filter..."
    role="textbox"
    defaultValue={selected[fieldValueName] ?? undefined}
    aria-label={
      fieldValueName === "value1"
        ? "Primary filter value"
        : "Secondary filter value"
    }
    onClick={(e) => e.stopPropagation()}
    onChange={({ target: { value } }) => {
      onColFilterEnterNum(field, {
        ...selected,
        [fieldValueName]: value ? parseFloat(value) : null,
      })
    }}
  />
)

export const NumFilter = ({
  field,
  parentRef,
}: {
  field: NumColField
  parentRef: React.RefObject<HTMLDivElement>
}) => {
  const colDef = useColDef()
  const selected = useAppliedNumFilters(field, colDef)
  return (
    <FilterPopup
      parentRef={parentRef}
      ariaLabel={`Filter trades by ${colDef[field].headerName} field value`}
      leftAlignFilter={field !== "tradeId"}
    >
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
