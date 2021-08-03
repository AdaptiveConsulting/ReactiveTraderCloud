import { StrictMode } from "react"
import ReactDOM from "react-dom"
import { GA_TRACKING_ID } from "@/constants"
import GlobalStyle from "@/theme/globals"
import { GlobalScrollbarStyle, ThemeProvider } from "@/theme"
import { LauncherApp } from "./LauncherApp"

import { connectToGateway } from "@adaptive/hydra-platform"
import { noop } from "rxjs"

export default function main() {
  if (!import.meta.env.VITE_MOCKS) {
    connectToGateway({
      url: import.meta.env.VITE_HYDRA_URL as string,
      interceptor: noop,
      useJson: true,
    })
  }

  ReactDOM.render(
    <StrictMode>
      <GlobalStyle />
      <ThemeProvider>
        <GlobalScrollbarStyle />
        <LauncherApp />
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
}
