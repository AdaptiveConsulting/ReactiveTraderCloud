import styled from "styled-components"

import { CrossIcon } from "@/client/components/icons"
import { Typography } from "@/client/components/Typography"

import { useColDef, useTrades$ } from "../Context"
import { onFilterReset, useFilterFields } from "../TradesState"

const FilterField = styled.div`
  display: flex;
  align-items: normal;
  background-color: ${({ theme }) =>
    theme.color["Colors/Background/bg-tertiary"]};

  border-radius: ${({ theme }) => theme.radius.xs};
  padding: 0 ${({ theme }) => theme.spacing.sm};
  cursor: pointer;
  align-items: center;

  &:hover {
    background-color: ${({ theme }) =>
      theme.color["Colors/Background/bg-quaternary"]};
  }
`

export const AppliedFilters = () => {
  const trades$ = useTrades$()
  const colDef = useColDef()
  const filterFields = useFilterFields(trades$, colDef)
  return (
    <>
      {filterFields.map((field) => (
        <FilterField
          key={field}
          onClick={() => onFilterReset(field)}
          data-testid="clear-filter-button"
        >
          <Typography variant="Text sm/Regular" paddingRight="md">
            {colDef[field].headerName}
          </Typography>
          <CrossIcon height={8} />
        </FilterField>
      ))}
    </>
  )
}
