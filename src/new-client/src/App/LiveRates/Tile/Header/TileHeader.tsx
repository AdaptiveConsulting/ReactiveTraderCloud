import styled from "styled-components/macro"
import { map } from "rxjs/operators"
import { format } from "date-fns"
import { getPrice$ } from "services/prices"
import { bind } from "@react-rxjs/core"
import { useTileCurrencyPair } from "../Tile.context"

const DeliveryDate = styled.div`
  color: ${({ theme }) => theme.core.textColor};
  font-size: 0.625rem;
  line-height: 1rem;
  opacity: 0.59;
  margin-left: auto;
  transition: margin-right 0.2s;
`

const HeaderWrapper = styled.div`
  display: flex;
  align-items: center;
`
const TileSymbol = styled.div`
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

export const Header: React.FC = () => {
  const { base, terms, symbol } = useTileCurrencyPair()
  const date = useDate(symbol)
  return (
    <HeaderWrapper>
      <TileSymbol data-qa="tile-header__tile-symbol">
        {base}/{terms}
      </TileSymbol>
      <DeliveryDate data-qa="tile-header__delivery-date">{date}</DeliveryDate>
    </HeaderWrapper>
  )
}

export const header$ = getDate$
