import styled from "styled-components"
import { parseISO, format } from "date-fns"
import {
  ComparatorType,
  onColFilterDateSelect,
  useAppliedDateFilters,
} from "../TradesState"
import {
  DateColField,
  DateFilterContent,
} from "../TradesState/filterState/dateFilterState"
import { FilterPopup } from "./components/FilterPopup"
import { ComparatorSelect } from "./components/ComparatorSelect"
import { useColDef } from "../Context"

const DateFilterInputInner = styled.input`
  padding: 8px 8px 5px 8px;
  color: ${({ theme }) => theme.core.textColor};
  ::-webkit-calendar-picker-indicator {
    filter: ${({ theme }) => (theme.name === "dark" ? "invert(1)" : "none")};
  }
`

const DateFilterInput = ({
  fieldValueName,
  field,
  selected,
}: {
  fieldValueName: "value1" | "value2"
  field: DateColField
  selected: DateFilterContent
}) => {
  return (
    <DateFilterInputInner
      defaultValue={
        selected[fieldValueName]
          ? format(selected[fieldValueName] as Date, "yyyy-MM-dd")
          : undefined
      }
      onClick={(e) => e.stopPropagation()}
      onChange={({ target: { value } }) => {
        onColFilterDateSelect(field, {
          ...selected,
          [fieldValueName]: value ? parseISO(value) : null,
        })
      }}
      type="date"
    />
  )
}

export const DateFilter = ({
  field,
  parentRef,
}: {
  field: DateColField
  parentRef: React.RefObject<HTMLDivElement>
}) => {
  const colDef = useColDef()
  const selected = useAppliedDateFilters(field, colDef)
  return (
    <FilterPopup parentRef={parentRef}>
      <ComparatorSelect
        selected={selected}
        onSelection={(comparator: ComparatorType) => {
          onColFilterDateSelect(field, {
            ...selected,
            comparator,
          })
        }}
      />
      <DateFilterInput
        selected={selected}
        field={field}
        fieldValueName="value1"
      />
      {selected.comparator === ComparatorType.InRange && (
        <DateFilterInput
          selected={selected}
          field={field}
          fieldValueName="value2"
        />
      )}
    </FilterPopup>
  )
}
