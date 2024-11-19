import { ROUTES_CONFIG } from "@/client/constants"

import { constructUrl } from "./constructUrl"
import { openWindow } from "./window/openWindow"

export const RFQ_ID_PARAM = "rfqId"

let windowReference: Window | undefined

export const showRfqInSellSide = async (rfqId: number | null) => {
  const route =
    ROUTES_CONFIG.sellSide + (rfqId ? `?${RFQ_ID_PARAM}=${rfqId}` : "")
  if (windowReference) {
    console.info(`Got ss win ref, push new RFQ ID ${rfqId} to history ..`)
    windowReference.focus()
    windowReference.history.pushState({}, "", route)
  } else {
    console.info(`No ss win ref, open new win for RFQ ID ${rfqId} ..`)
    windowReference = await openWindow(
      {
        url: constructUrl(route),
        name: "AdaptiveBankCreditRFQ",
        displayName: "Adaptive Bank RFQ Queue",
        width: 615,
        height: 400,
      },
      () => {
        console.info(`closing ss win ..`)
        windowReference = undefined
      },
    )
  }
}
