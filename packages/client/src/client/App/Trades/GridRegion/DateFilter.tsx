import { format, parseISO } from "date-fns"
import styled from "styled-components"

import { useColDef } from "../Context"
import {
  ComparatorType,
  onColFilterDateSelect,
  useAppliedDateFilters,
} from "../TradesState"
import {
  DateColField,
  DateFilterContent,
} from "../TradesState/filterState/dateFilterState"
import { ComparatorSelect } from "./components/ComparatorSelect"
import { FilterPopup } from "./components/FilterPopup"

const DateFilterInputInner = styled.input`
  ${({ theme }) => theme.textStyles["Text sm/Regular"]}
  padding: 8px 8px 5px 8px;
  color: ${({ theme }) => theme.color["Colors/Text/text-primary (900)"]};
  ::-webkit-calendar-picker-indicator {
    filter: ${({ theme }) => (theme.name === "dark" ? "invert(1)" : "none")};
  }
`

const DateFilterInput = ({
  fieldValueName,
  field,
  selected,
  dataTestId,
}: {
  fieldValueName: "value1" | "value2"
  dataTestId?: string
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
      data-testid={dataTestId}
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
    <FilterPopup
      parentRef={parentRef}
      ariaLabel={`Filter trades by ${field} field value`}
    >
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
        dataTestId="date-filter-input"
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
