import { ROUTES_CONFIG } from "@/constants"
import { calculateWindowCoordinates, Offset } from "@/utils"
import { constructUrl } from "@/utils/url"
import { openWindow } from "@/utils/window/openWindow"

import { tearOut } from "./state"

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

export async function handleTearOut(symbol: string, tileRef?: HTMLDivElement) {
  let position = {}

  if (tileRef) {
    const coords = calculateWindowCoordinates(tileRef)
    position = await calculateOpeningWindowCoords(coords)
  }

  openWindow(
    {
      name: symbol,
      url: constructUrl(ROUTES_CONFIG.tile.replace(":symbol", symbol)),
      width: 380,
      height: 200,
      includeInSnapshots: false,
      ...position,
    },
    () => {
      tearOut(symbol, false)
    },
  )
}

export const supportsTearOut = false
