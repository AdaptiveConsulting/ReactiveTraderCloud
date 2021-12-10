import { TileView } from "@/App/LiveRates/selectedView"
import { Tile } from "@/App/LiveRates/Tile"
import { Loader } from "@/components/Loader"
import { useCurrencyPair } from "@/services/currencyPairs"
import { withSubscriber } from "@/utils/withSubscriber"
import styled from "styled-components"

const Wrapper = styled("div")`
  margin: 8px;
`

// Finsemble specific version to not use localStorage for the view
export const TornOutTile = withSubscriber<{
  symbol: string
  view: TileView
  supportsTearOut?: boolean
}>(
  ({ symbol, view, supportsTearOut }) => (
    <Wrapper>
      <Tile
        currencyPair={useCurrencyPair(symbol)}
        isAnalytics={view === TileView.Analytics}
        isTornOut
        supportsTearOut={supportsTearOut}
      />
    </Wrapper>
  ),

  <Loader ariaLabel="Loading live FX exchange rates" />,
)
