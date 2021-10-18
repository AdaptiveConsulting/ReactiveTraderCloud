import { LiveRates } from "@/App/LiveRates"
import { tearOut, tearOutEntry$ } from "@/App/LiveRates/Tile/TearOut/state"
import { useObservableSubscription } from "@/utils/useObservableSubscription"
import { openWindow } from "../utils/window"

export const Tiles = () => {
  useObservableSubscription(
    tearOutEntry$.subscribe(
      async ([symbol, tornOut]) => {
        if (tornOut) {
          openWindow(
            {
              url: `/spot/${symbol}`,
              name: symbol,
              width: 380,
              height: 170,
            },
            () => tearOut(symbol, false),
          )
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

  return <LiveRates />
}
