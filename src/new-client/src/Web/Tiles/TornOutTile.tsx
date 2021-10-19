import { TileView } from "@/App/LiveRates/selectedView"
import { tearOutEntry$ } from "@/App/LiveRates/Tile/TearOut/state"
import { TornOutTile as BaseTornOutTile } from "@/App/LiveRates/Tile/TearOut/TornOutTile"
import { useObservableSubscription } from "@/utils/useObservableSubscription"

export const TornOutTile: React.FC<{ symbol: string; view: TileView }> = ({
  symbol,
  view,
}) => {
  useObservableSubscription(
    tearOutEntry$.subscribe(
      async ([symbol, tornOut]) => {
        if (!tornOut) {
          window.close()
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

  return <BaseTornOutTile symbol={symbol} view={view} />
}
