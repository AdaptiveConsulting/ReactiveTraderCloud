import React, { FC } from 'react'
import { Table, TableRow } from './styles'

interface Col {
  title: String
  id: String
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
          {cols.map(({ title }, index) => (
            <th key={index}>{title}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows &&
          rows.map((row: any, rowIndex: number) => {
            return (
              <TableRow key={rowIndex} status={row.status}>
                {cols.map((col: any, cellIndex: number) => {
                  return <td key={cellIndex}>{row[col.id]}</td>
                })}
              </TableRow>
            )
          })}
      </tbody>
    </Table>
  )
}
