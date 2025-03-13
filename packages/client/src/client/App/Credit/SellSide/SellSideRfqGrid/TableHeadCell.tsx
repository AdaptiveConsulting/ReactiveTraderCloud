import styled from "styled-components"

import { Typography } from "@/client/components/Typography"

import { ColKey, rfqColDef } from "./colConfig"

const TableHeadCell = styled.th<{ numeric: boolean; width: number }>`
  text-align: ${({ numeric }) => (numeric ? "right" : "left")};
  ${({ numeric }) => (numeric ? "padding-right: 1.5rem;" : null)};
  width: ${({ width }) => `${width} px`};
  background-color: ${({ theme }) =>
    theme.color["Colors/Background/bg-secondary_subtle"]};
`
interface Props<T extends ColKey> {
  field: T
}

export const TableHeadCellContainer = <T extends ColKey>({
  field,
}: Props<T>) => {
  const { headerName, filterType, width } = rfqColDef[field]
  return (
    <TableHeadCell numeric={filterType === "number"} width={width} scope="col">
      <Typography
        variant="Text sm/Regular"
        color="Colors/Text/text-quaternary (500)"
      >
        {headerName}
      </Typography>
    </TableHeadCell>
  )
}
