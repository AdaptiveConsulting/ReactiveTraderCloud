import { useEffect } from "react"
import styled from "styled-components"

import {
  SELECTED_VIEW_KEY,
  TileView,
} from "@/client/App/LiveRates/selectedView"
import { Tile } from "@/client/App/LiveRates/Tile"
import { Loader } from "@/client/components/Loader"
import { useCurrencyPair } from "@/services/currencyPairs"
import { useLocalStorage } from "@/client/utils"
import { closeWindow } from "@/client/utils/window/closeWindow"
import { withSubscriber } from "@/client/utils/withSubscriber"

import { useTearOutEntry } from "./state"

const Wrapper = styled("div")`
  height: 100vh;
  overflow-y: auto;
  padding: 8px;
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
