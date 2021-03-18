import styled from "styled-components"
import { colConfigs, NumColField, NumFilterContent } from "../TradesState"
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
  outline: none;
  border: none;
  font-size: 0.75rem;
  width: 100%;
  padding: 2px 10px;
  color: ${({ theme }) => theme.core.textColor};
  border-bottom: 1.5px solid ${({ theme }) => theme.primary[5]};
  caret-color: ${({ theme }) => theme.primary.base};
  &:focus {
    outline: none !important;
    border-color: ${({ theme }) => theme.core.textColor};
  }
`

const FilterValueInput: React.FC<{
  field: NumColField
  selected: NumFilterContent
  fieldValueName: "value1" | "value2"
}> = ({ field, selected, fieldValueName }) => (
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

export const NumFilter: React.FC<{
  field: NumColField
  parentRef: React.RefObject<HTMLDivElement>
}> = ({ field, parentRef }) => {
  const selected = useAppliedNumFilters(field)
  return (
    <FilterPopup
      parentRef={parentRef}
      ariaLabel={`Filter trades by ${colConfigs[field].headerName} field value`}
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
