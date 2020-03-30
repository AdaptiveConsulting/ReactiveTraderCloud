import React, { FC } from 'react'
import { Table, TableRow, TableCell, TableHeader } from './styles'

export interface Col {
  title: String
  id: String
  align?: 'center' | 'right'
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
                  return (
                    <TableCell align={col.align} key={cellIndex}>
                      {row[col.id]}
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
