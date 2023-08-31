import { ROUTES_CONFIG } from "client/constants"
import { constructUrl } from "@/client/utils/constructUrl"
import { openWindow } from "client/utils/window/openWindow"

import { tearOut } from "./state"

export function handleTearOut(symbol: string) {
  openWindow(
    {
      url: constructUrl(ROUTES_CONFIG.tile.replace(":symbol", symbol)),
      name: symbol,
      width: 380,
      height: 172,
    },
    () => tearOut(symbol, false),
  )
}

export const supportsTearOut = true
