import { ROUTES_CONFIG } from "@/constants"
import { constructUrl } from "@/utils/url"
import { openWindow } from "@/utils/window/openWindow"

export const RFQ_ID_PARAM = "rfqId"

let windowReference: Window | undefined

export const toSellSideView = async (rfqId: number | null) => {
  const route =
    ROUTES_CONFIG.sellSide + (rfqId ? `?${RFQ_ID_PARAM}=${rfqId}` : "")
  if (windowReference) {
    windowReference.focus()
    windowReference.history.pushState({}, "", route)
  } else {
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
  }
}
