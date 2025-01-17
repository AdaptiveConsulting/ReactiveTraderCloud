import styled from "styled-components"

import { Import } from "@/client/components/icons/Import"
import { Trade } from "@/services/trades"

import { useColDef, useColFields, useTrades$ } from "../Context"
import { ColDef, useTableTrades } from "../TradesState"

const Container = styled.div`
  svg {
    fill: ${({ theme }) =>
      theme.newTheme.color["Colors/Text/text-quaternary (500)"]};
  }
`

const downloadCsv = (
  trades: Trade[],
  colDef: ColDef,
  colFields: (string | number)[],
) => {
  let csv = ""
  // CSV header
  colFields.forEach((field) => {
    csv += colDef[field].headerName + ","
  })
  csv += "\n"
  // CSV body
  trades.map((trade) => {
    colFields.map((field) => {
      const res =
        colDef[field].excelValueFormatter?.(trade[field]) ??
        colDef[field].valueFormatter?.(trade[field]) ??
        trade[field]
      csv += res + ", "
    })
    csv += "\n"
  })

  // Create and cleanup hidden element to trigger download in browser
  const hiddenElement = document.createElement("a")
  hiddenElement.href = "data:text/csv;charset=utf-8," + encodeURI(csv)
  hiddenElement.target = "_blank"
  hiddenElement.download = "RT-Blotter.csv"
  hiddenElement.click()
  hiddenElement.parentElement?.removeChild(hiddenElement)
}

export const ExcelButton = () => {
  const rows$ = useTrades$()
  const colDef = useColDef()
  const colFields = useColFields()
  const trades = useTableTrades(rows$, colDef)

  return (
    <Container
      onClick={() => downloadCsv(trades, colDef, colFields)}
      aria-label="Export to CSV"
    >
      <Import />
    </Container>
  )
}
