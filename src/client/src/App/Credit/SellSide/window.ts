import { useEffect } from "react"
import { RFQ_ID_PARAM } from "@/utils"
import { highlightRfqId } from "./sellSideState"

const getRfqSearchParam = (url: string) =>
  url?.split("?")?.[1]?.split(`${RFQ_ID_PARAM}=`)?.[1]

const highlightNewRfq = (url: string) => {
  const rfqId = getRfqSearchParam(url)
  return highlightRfqId(rfqId == null ? null : Number(rfqId))
}

/**
 * Reacts to rfq id in route on load and after history changes to update
 * sell-side event streams
 */
export const useRfqSearchParamEffect = () => {
  useEffect(() => {
    // New window, selectRfq
    highlightNewRfq(window.location.search)

    // Intercepts pushState and selects rfqId to highlight
    window.history.pushState = new Proxy(window.history.pushState, {
      apply: (
        target,
        thisArg,
        argArray: [
          data: Record<string, unknown>,
          unused: string,
          url?: string | URL | null | undefined,
        ],
      ) => {
        highlightNewRfq(argArray[2] as string)
        return target.apply(thisArg, argArray)
      },
    })
  }, [])
}
