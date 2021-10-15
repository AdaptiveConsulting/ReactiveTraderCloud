import { TileView } from "@/App/LiveRates/selectedView"
import { tearOutEntry$ } from "@/App/LiveRates/Tile/TearOut/state"
import { TearOutTile as BaseTearOutTile } from "@/App/LiveRates/Tile/TearOut/TearOutTile"
import { useObservableSubscription } from "@/utils/useObservableSubscription"

export const TearOutTile: React.FC<{ symbol: string; view: TileView }> = ({
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

  return <BaseTearOutTile symbol={symbol} view={view} />
}
