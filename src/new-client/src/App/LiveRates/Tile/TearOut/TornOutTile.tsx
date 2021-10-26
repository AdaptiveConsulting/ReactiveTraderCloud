import { SELECTED_VIEW_KEY, TileView } from "@/App/LiveRates/selectedView"
import { Tile } from "@/App/LiveRates/Tile"
import { Loader } from "@/components/Loader"
import { useCurrencyPair } from "@/services/currencyPairs"
import { useLocalStorage } from "@/utils"
import { closeWindow } from "@/utils/window/closeWindow"
import { withSubscriber } from "@/utils/withSubscriber"
import { useEffect } from "react"
import styled from "styled-components"
import { tearOutEntry$ } from "./state"

const Wrapper = styled("div")`
  margin: 8px;
`

export const TornOutTile = withSubscriber<{
  symbol: string
  view: TileView
  supportsTearOut?: boolean
}>(({ symbol, view: initView, supportsTearOut }) => {
  const [view] = useLocalStorage(SELECTED_VIEW_KEY, initView)

  useEffect(() => {
    const subscription = tearOutEntry$.subscribe(
      async ([, tornOut]) => {
        if (!tornOut) {
          closeWindow()
        }
      },
      (e) => {
        console.error(e)
      },
      () => {
        console.error("tear out entry stream completed!?")
      },
    )

    return () => {
      if (subscription) {
        subscription.unsubscribe()
      }
    }
  }, [])

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
