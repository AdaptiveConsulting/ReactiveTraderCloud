import React, { FC, ReactNode } from 'react'
import { Table, TableRow, TableCell, TableHeader } from './styles'

export interface Col {
  title: String
  id: String
  align?: 'center' | 'right'
  formatter?: (value: any) => void
  fixedWidth?: boolean
}
interface ResultsTableProps {
  cols: Col[]
  children: ReactNode
}

interface ResultsTableRowProps {
  row: any
  cols: Col[]
  status?: 'rejected' | 'done' | 'pending' | undefined
}

interface LoadingRowProps {
  cols: Col[]
}

export const LoadingRow: FC<LoadingRowProps> = ({ cols }) => (
  <TableRow>
    <TableCell>Loading latest prices...</TableCell>
    {cols.map((current, index) => (
      <TableCell key={index}></TableCell>
    ))}
  </TableRow>
)

export const ResultsTableRow: FC<ResultsTableRowProps> = ({ row, cols, status }) => (
  <TableRow status={status}>
    {cols.map((col: any, cellIndex: number) => {
      const value = row[col.id]
      const formattedValue = col.formatter ? col.formatter(value) : value
      return (
        <TableCell align={col.align} key={cellIndex} fixedWidth={col.fixedWidth}>
          {formattedValue}
        </TableCell>
      )
    })}
  </TableRow>
)

export const ResultsTable: FC<ResultsTableProps> = ({ cols, children }) => {
  return (
    <Table>
      <thead>
        <tr>
          {cols.map(({ title, align }, index) => (
            <TableHeader align={align} key={index}>
              {title}
            </TableHeader>
          ))}
        </tr>
      </thead>
      <tbody>{children}</tbody>
    </Table>
  )
}
