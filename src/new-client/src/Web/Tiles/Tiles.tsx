import { LiveRates } from "@/App/LiveRates"
import { tearOut, tearOutEntry$ } from "@/App/LiveRates/Tile/TearOut/state"
import { useObservableSubscription } from "@/utils/useObservableSubscription"

export const Tiles = () => {
  useObservableSubscription(
    tearOutEntry$.subscribe(
      async ([symbol, tornOut]) => {
        if (tornOut) {
          const windowRef = window.open(
            `/spot/${symbol}`,
            symbol,
            "width=380,height=170",
          )

          const unloadListener = () => {
            setTimeout(() => {
              if (windowRef?.closed) {
                tearOut(symbol, false)
              } else {
                // needs to be re-set after window reload
                setUnloadListener()
              }
            }, 100)
          }

          const setUnloadListener = () =>
            windowRef?.addEventListener("unload", unloadListener)

          setUnloadListener()
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
