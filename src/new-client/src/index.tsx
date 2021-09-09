import { GA_TRACKING_ID } from "./constants"
import main from "./main"

declare global {
  const __TARGET__: "web" | "openfin" | "finsemble"

  interface Window {
    ga: any
  }
}

main()

const { ga } = window

ga("create", {
  trackingId: GA_TRACKING_ID,
  transport: "beacon",
})

ga("set", {
  dimension1: "browser",
  dimension2: "browser",
  dimension3: import.meta.env,
  page: window.location.pathname,
})

ga("send", "pageview")
