import { SELECTED_VIEW_KEY, TileView } from "@/App/LiveRates/selectedView"
import { Tile } from "@/App/LiveRates/Tile"
import { Loader } from "@/components/Loader"
import { useCurrencyPair } from "@/services/currencyPairs"
import { useLocalStorage } from "@/utils"
import { closeWindow } from "@/utils/window/closeWindow"
import { withSubscriber } from "@/utils/withSubscriber"
import { useEffect } from "react"
import styled from "styled-components"
import { useTearOutEntry } from "./state"

const Wrapper = styled("div")`
  margin: 8px;
`

export const TornOutTile = withSubscriber<{
  symbol: string
  view: TileView
  supportsTearOut?: boolean
}>(({ symbol, view: initView, supportsTearOut }) => {
  const [view] = useLocalStorage(SELECTED_VIEW_KEY, initView)
  const tearOutEntry = useTearOutEntry()

  useEffect(() => {
    if (tearOutEntry) {
      const [, tornOut] = tearOutEntry
      if (!tornOut) {
        closeWindow()
      }
    }
  }, [tearOutEntry])

  return (
    <Wrapper>
      <Tile
        currencyPair={useCurrencyPair(symbol)}
        isAnalytics={view === TileView.Analytics}
        isTornOut
        supportsTearOut={supportsTearOut}
      />
    </Wrapper>
  )
}, <Loader ariaLabel="Loading live FX exchange rates" />)
