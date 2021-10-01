import { StrictMode } from "react"
import ReactDOM from "react-dom"
import { GA_TRACKING_ID } from "@/constants"
import GlobalStyle from "@/theme/globals"
import { GlobalScrollbarStyle, ThemeProvider } from "@/theme"
import { OpenFinApp } from "./OpenFinApp"
import { PlatformContext } from "@/platform"
import { connectToGateway } from "@adaptive/hydra-platform"
import { noop } from "rxjs"

export default function main() {
  if (!import.meta.env.VITE_MOCKS) {
    connectToGateway({
      url: `${window.location.origin}/ws`,
      interceptor: noop,
      useJson: true,
    })
  }

  ReactDOM.render(
    <StrictMode>
      <PlatformContext.Provider value={{ type: "openfin" }}>
        <GlobalStyle />
        <ThemeProvider>
          <GlobalScrollbarStyle />
          <OpenFinApp />
        </ThemeProvider>
      </PlatformContext.Provider>
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
