import styled from "styled-components/macro"
import { merge } from "rxjs"
import { map } from "rxjs/operators"
import { bind } from "@react-rxjs/core"
import { format } from "date-fns"
import { getCurrencyPair$ } from "services/currencyPairs"
import { getPrice$ } from "services/prices"
import { DeliveryDate } from "./styled"
import { SymbolContext } from "./Tile"
import { useContext } from "react"

export const [useBaseTerm, getBaseTerm$] = bind((symbol: string) =>
  getCurrencyPair$(symbol).pipe(map(({ base, terms }) => `${base}/${terms}`)),
)

const [useDate, getDate$] = bind((symbol: string) =>
  getPrice$(symbol).pipe(
    map(
      ({ valueDate }) =>
        `SPT (${format(new Date(valueDate), "dd MMM").toUpperCase()})`,
    ),
  ),
)

export const Header = styled.div`
  display: flex;
  align-items: center;
`
export const TileSymbol = styled.div`
  color: ${({ theme }) => theme.core.textColor};
  font-size: 0.8125rem;
  line-height: 1rem;
`

export const TileHeader: React.FC = () => {
  const symbol = useContext(SymbolContext)
  const baseTerm = useBaseTerm(symbol)
  const date = useDate(symbol)
  return (
    <Header>
      <TileSymbol data-qa="tile-header__tile-symbol">{baseTerm}</TileSymbol>
      <DeliveryDate data-qa="tile-header__delivery-date">{date}</DeliveryDate>
    </Header>
  )
}

export const tileHeader$ = (symbol: string) =>
  merge(getBaseTerm$(symbol), getDate$(symbol))
