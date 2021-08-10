import { GA_TRACKING_ID } from "./constants"

async function main() {
  if (__TARGET__ === "web") {
    await import("@/Web")
  } else if (__TARGET__ === "openfin") {
    await import("@/OpenFin")
  } else if (__TARGET__ === "finsemble") {
    await import("@/Finsemble")
  }
}

main()

declare global {
  const __TARGET__: "web" | "openfin" | "finsemble"

  interface Window {
    ga: any
  }
}

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
