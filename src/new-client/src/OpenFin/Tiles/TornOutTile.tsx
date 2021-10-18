import { TileView } from "@/App/LiveRates/selectedView"
import { tearOutEntry$ } from "@/App/LiveRates/Tile/TearOut/state"
import { TornOutTile as BaseTornOutTile } from "@/App/LiveRates/Tile/TearOut/TornOutTile"
import { useObservableSubscription } from "@/utils/useObservableSubscription"
import { closeWindow } from "../utils/window"

export const TornOutTile: React.FC<{ symbol: string; view: TileView }> = ({
  symbol,
  view,
}) => {
  useObservableSubscription(
    tearOutEntry$.subscribe(
      async ([symbol, tornOut]) => {
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
    ),
  )

  return <BaseTornOutTile symbol={symbol} view={view} supportsTearOut={false} />
}
