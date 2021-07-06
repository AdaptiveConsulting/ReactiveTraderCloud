import { createContext, useContext } from "react"
import styled from "styled-components"
import { TileView } from "@/App/LiveRates/selectedView"
import { Tile, tile$ } from "@/App/LiveRates/Tile"
import { useDate } from "@/App/LiveRates/Tile/Header/TileHeader"
import { useTileCurrencyPair } from "@/App/LiveRates/Tile/Tile.context"
import { useCurrencyPair } from "@/services/currencyPairs"
import { PopOutIcon } from "../icons/PopOutIcon"
import { onTearOut } from "./tornOutTiles"

export { tile$ }

interface Props {
  symbol: string
  view: TileView
  isTornOut: boolean
}

export const DetachableTile: React.FC<Props> = ({
  symbol,
  view,
  isTornOut,
}) => {
  const currencyPair = useCurrencyPair(symbol)

  return (
    <TearOutContext.Provider value={isTornOut}>
      <Tile
        HeaderComponent={Header}
        currencyPair={currencyPair}
        isAnalytics={view === TileView.Analytics}
      />
    </TearOutContext.Provider>
  )
}

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

const HeaderAction = styled.div``

const Header: React.FC = () => {
  const { base, terms, symbol } = useTileCurrencyPair()
  const date = useDate(symbol)
  const isTornOut = useContext(TearOutContext)

  return (
    <HeaderWrapper>
      <TileSymbol data-qa="tile-header__tile-symbol">
        {base}/{terms}
      </TileSymbol>

      <DeliveryDate data-qa="tile-header__delivery-date">{date}</DeliveryDate>

      {!isTornOut && (
        <HeaderAction onClick={() => onTearOut(symbol)}>
          <PopOutIcon />
        </HeaderAction>
      )}
    </HeaderWrapper>
  )
}

const TearOutContext = createContext(false)
