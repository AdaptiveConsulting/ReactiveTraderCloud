import styled from "styled-components"

import { TileView } from "@/client/App/LiveRates/selectedView"
import { Tile } from "@/client/App/LiveRates/Tile"
import { Loader } from "@/client/components/Loader"
import { withSubscriber } from "@/client/utils/withSubscriber"
import { useCurrencyPair } from "@/services/currencyPairs"

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
