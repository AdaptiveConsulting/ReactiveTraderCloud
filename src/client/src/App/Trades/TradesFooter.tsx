import { Trade } from "@/services/trades"
import { bind } from "@react-rxjs/core"
import { Observable } from "rxjs"
import { map } from "rxjs/operators"
import styled from "styled-components"
import { useTrades$ } from "./Context"

const TradesFooterStyled = styled("div")`
  height: 2rem;
  padding: 0.5rem 0 0.5rem 0.75rem;
  font-size: 0.625rem;
  line-height: 1rem;
  display: flex;
  align-items: center;
  color: ${({ theme }) => theme.core.textColor};
  background-color: ${({ theme }) => theme.core.lightBackground};
  border-radius: 0 0 0.25rem 0.25rem;
`

const TradesFooterText = styled.span`
  opacity: 0.6;
`
const [useTotalRows] = bind<[Observable<Trade[]>], number>(
  (trades$: Observable<Trade[]>) => {
    return trades$.pipe(map((trades) => trades.length))
  },
  0,
)

const [useDisplayRows] = bind<[Observable<Trade[]>], number>(
  (trades$: Observable<Trade[]>) => {
    return trades$.pipe(map((trades) => trades.length))
  },
  0,
)

export const TradesFooter = () => {
  const trades$ = useTrades$()
  const totalRows = useTotalRows(trades$)
  const displayRows = useDisplayRows(trades$)

  return (
    <TradesFooterStyled>
      <TradesFooterText data-qa="blotter__blotter-status-text">
        Displaying rows {displayRows} of {totalRows}
      </TradesFooterText>
    </TradesFooterStyled>
  )
}
