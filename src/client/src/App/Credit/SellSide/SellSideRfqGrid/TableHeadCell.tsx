import styled from "styled-components"
import { ColKey, rfqColDef } from "./colConfig"

const TableHeadCell = styled.th<{ numeric: boolean; width: number }>`
  text-align: ${({ numeric }) => (numeric ? "right" : "left")};
  ${({ numeric }) => (numeric ? "padding-right: 1.5rem;" : null)};
  width: ${({ width }) => `${width} px`};
  font-weight: unset;
  background-color: ${({ theme }) => theme.core.darkBackground};
  border-bottom: 0.25rem solid ${({ theme }) => theme.core.lightBackground};
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
      {headerName}
    </TableHeadCell>
  )
}
