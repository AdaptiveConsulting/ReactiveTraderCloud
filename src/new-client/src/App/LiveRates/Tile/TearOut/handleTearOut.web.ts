import { constructUrl } from "@/utils/url"
import { openWindow } from "@/utils/window/openWindow"
import { tearOut } from "./state"

export function handleTearOut(symbol: string) {
  openWindow(
    {
      url: constructUrl(`/spot/${symbol}`),
      name: symbol,
      width: 380,
      height: 170,
    },
    () => tearOut(symbol, false),
  )
}

export const supportsTearOut = true
