import React, { FC } from 'react'
import { Table, TableRow, TableCell, TableHeader } from './styles'

export interface Col {
  title: String
  id: String
  align?: 'center' | 'right'
  formatter?: (value: any) => void
}
interface ResultsTableProps {
  cols: Col[]
  rows: any[]
}

export const ResultsTable: FC<ResultsTableProps> = ({ cols, rows }) => {
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
      <tbody>
        {rows &&
          rows.map((row: any, rowIndex: number) => {
            return (
              <TableRow key={rowIndex} status={row.status}>
                {cols.map((col: any, cellIndex: number) => {
                  const value = row[col.id]
                  const formattedValue = col.formatter ? col.formatter(value) : value
                  return (
                    <TableCell align={col.align} key={cellIndex}>
                      {formattedValue}
                    </TableCell>
                  )
                })}
              </TableRow>
            )
          })}
      </tbody>
    </Table>
  )
}
