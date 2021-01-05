import { bind } from "@react-rxjs/core"
import { map } from "rxjs/operators"
import styled from "styled-components"
import { trades$ } from "services/trades"

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
const [useTotalRows] = bind<number>(
  trades$.pipe(map((trades) => trades.length)),
  0,
)

export const TradesFooter: React.FC = () => {
  const totalRows = useTotalRows()
  return (
    <TradesFooterStyled>
      <TradesFooterText data-qa="blotter__blotter-status-text">
        Displaying rows {totalRows} of {totalRows}
      </TradesFooterText>
    </TradesFooterStyled>
  )
}
