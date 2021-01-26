import styled from "styled-components/macro"
import { map } from "rxjs/operators"
import { format } from "date-fns"
import { getPrice$ } from "services/prices"
import { DeliveryDate } from "./styled"
import { useTileCurrencyPair } from "./context"
import { bind } from "@react-rxjs/core"

export const Header = styled.div`
  display: flex;
  align-items: center;
`
export const TileSymbol = styled.div`
  color: ${({ theme }) => theme.core.textColor};
  font-size: 0.8125rem;
  line-height: 1rem;
`

const [useDate, getDate$] = bind((symbol: string) =>
  getPrice$(symbol).pipe(
    map(
      ({ valueDate }) =>
        `SPT (${format(new Date(valueDate), "dd MMM").toUpperCase()})`,
    ),
  ),
)

export const TileHeader: React.FC = () => {
  const { base, terms, symbol } = useTileCurrencyPair()
  const date = useDate(symbol)
  return (
    <Header>
      <TileSymbol data-qa="tile-header__tile-symbol">
        {base}/{terms}
      </TileSymbol>
      <DeliveryDate data-qa="tile-header__delivery-date">{date}</DeliveryDate>
    </Header>
  )
}

export const tileHeader$ = getDate$
