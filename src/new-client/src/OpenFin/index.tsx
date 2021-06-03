import { StrictMode } from "react"
import ReactDOM from "react-dom"
import { GA_TRACKING_ID } from "@/constants"
import GlobalStyle from "@/theme/globals"
import { GlobalScrollbarStyle, ThemeProvider } from "@/theme"
import { OpenFinApp } from "./OpenFinApp"

ReactDOM.render(
  <StrictMode>
    <GlobalStyle />
    <ThemeProvider>
      <GlobalScrollbarStyle />
      <OpenFinApp />
    </ThemeProvider>
  </StrictMode>,
  document.getElementById("root"),
)

const { ga } = window

ga("create", {
  trackingId: GA_TRACKING_ID,
  transport: "beacon",
})

ga("set", {
  dimension1: "openfin",
  dimension2: "openfin",
  dimension3: import.meta.env,
  page: window.location.pathname,
})

ga("send", "pageview")
