import { StrictMode } from "react"
import ReactDOM from "react-dom"
import { GA_TRACKING_ID } from "@/constants"
import GlobalStyle from "@/theme/globals"
import { GlobalScrollbarStyle, ThemeProvider } from "@/theme"
import { FinsembleApp } from "./FinsembleApp"

import { connectToGateway } from "@adaptive/hydra-platform"
import { noop } from "rxjs"

if (!import.meta.env.VITE_MOCKS) {
  connectToGateway({
    url: `${window.location.origin}/ws`,
    interceptor: noop,
    useJson: true,
  })
}

ReactDOM.render(
  <StrictMode>
    <GlobalStyle />
    <ThemeProvider>
      <GlobalScrollbarStyle />
      <FinsembleApp />
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
  dimension1: "finsemble",
  dimension2: "finsemble",
  dimension3: import.meta.env,
  page: window.location.pathname,
})

ga("send", "pageview")
