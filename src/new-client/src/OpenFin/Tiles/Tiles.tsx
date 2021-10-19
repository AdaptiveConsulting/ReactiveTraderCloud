import { LiveRates } from "@/App/LiveRates"
import { tearOut, tearOutEntry$ } from "@/App/LiveRates/Tile/TearOut/state"
import { calculateWindowCoordinates, Offset } from "@/utils"
import { constructUrl } from "@/utils/url"
import { useObservableSubscription } from "@/utils/useObservableSubscription"
import { openWindow } from "../utils/window"

const calculateOpeningWindowCoords = async (coords: Offset) => {
  const view = await fin.View.getCurrent()
  const window = await view.getCurrentWindow()
  const [viewBounds, windowBounds] = await Promise.all([
    view.getBounds(),
    window.getBounds(),
  ])

  return {
    x: coords.x + viewBounds.left + windowBounds.left - 20,
    y: coords.y + viewBounds.top + windowBounds.top - 20,
  }
}

export const Tiles = () => {
  useObservableSubscription(
    tearOutEntry$.subscribe(
      async ([symbol, tornOut, tileRef]) => {
        if (tornOut) {
          const coords = calculateWindowCoordinates(tileRef)
          const position = await calculateOpeningWindowCoords(coords)
          const options = {
            name: symbol,
            url: constructUrl(`/spot/${symbol}`),
            width: 380,
            height: 200,
            includeInSnapshots: false,
            ...position,
          }

          openWindow(options, () => {
            tearOut(symbol, false)
          })
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
