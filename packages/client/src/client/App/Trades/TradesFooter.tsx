import { bind } from "@react-rxjs/core"
import { Observable } from "rxjs"
import { map } from "rxjs/operators"
import styled from "styled-components"

import { Typography } from "@/client/components/Typography"
import { Trade } from "@/services/trades"

import { useColDef, useTrades$ } from "./Context"
import { useTableTrades } from "./TradesState"

const TradesFooterStyled = styled.div`
  ${({ theme }) => theme.textStyles["Text sm/Regular"]}
  display: flex;
  color: ${({ theme }) => theme.color["Colors/Text/text-disabled"]};
  padding: ${({ theme }) => theme.spacing.lg};
  padding-top: ${({ theme }) => theme.spacing.sm};
  display: flex;
  align-items: center;
`

const [useTotalRows] = bind<[Observable<Trade[]>], number>(
  (trades$: Observable<Trade[]>) => {
    return trades$.pipe(map((trades) => trades.length))
  },
  0,
)

export const TradesFooter = () => {
  const rows$ = useTrades$()
  const colDef = useColDef()
  const trades = useTableTrades(rows$, colDef)
  const totalRows = useTotalRows(rows$)
  const displayRows = trades.length

  return (
    <TradesFooterStyled>
      <Typography
        color="Colors/Text/text-disabled"
        data-qa="blotter__blotter-status-text"
      >
        Displaying rows {displayRows} of {totalRows}
      </Typography>
    </TradesFooterStyled>
  )
}
