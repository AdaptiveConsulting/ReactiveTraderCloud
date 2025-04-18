import { ROUTES_CONFIG } from "@/client/constants"

import { constructUrl } from "./constructUrl"
import { openWindow } from "./window/openWindow"

export const RFQ_ID_PARAM = "rfqId"

let windowReference: Window | undefined

export const showRfqInSellSide = async (rfqId: number | null) => {
  const route =
    ROUTES_CONFIG.sellSide + (rfqId ? `?${RFQ_ID_PARAM}=${rfqId}` : "")

  if (!windowReference || windowReference.closed) {
    windowReference = await openWindow(
      {
        url: constructUrl(route),
        name: "AdaptiveBankCreditRFQ",
        displayName: "Adaptive Bank RFQ Queue",
        width: 615,
        height: 400,
      },
      () => {
        windowReference = undefined
      },
    )
  } else {
    windowReference.focus()
    windowReference.history.pushState({}, "", route)
  }
}
