import styled from "styled-components"

import { CrossIcon } from "@/client/components/icons"
import { Typography } from "@/client/components/Typography"

import { useColDef, useTrades$ } from "../Context"
import { onFilterReset, useFilterFields } from "../TradesState"

const FilterField = styled.div`
  display: flex;
  align-items: normal;
  background-color: ${({ theme }) =>
    theme.newTheme.color["Colors/Background/bg-tertiary"]};

  border-radius: ${({ theme }) => theme.newTheme.radius.xs};
  padding: 0 ${({ theme }) => theme.newTheme.spacing.sm};
  cursor: pointer;
  align-items: center;

  &:hover {
    background-color: ${({ theme }) =>
      theme.newTheme.color["Colors/Background/bg-quaternary"]};
  }
`

export const AppliedFilters = () => {
  const trades$ = useTrades$()
  const colDef = useColDef()
  const filterFields = useFilterFields(trades$, colDef)
  return (
    <>
      {filterFields.map((field) => (
        <FilterField key={field} onClick={() => onFilterReset(field)}>
          <Typography variant="Text sm/Regular" paddingRight="md">
            {colDef[field].headerName}
          </Typography>
          <CrossIcon height={8} />
        </FilterField>
      ))}
    </>
  )
}
