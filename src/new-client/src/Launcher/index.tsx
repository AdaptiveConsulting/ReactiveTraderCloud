import { StrictMode } from "react"
import ReactDOM from "react-dom"
import { BASE_PATH, GA_TRACKING_ID } from "@/constants"
import GlobalStyle from "@/theme/globals"
import { GlobalScrollbarStyle, ThemeProvider } from "@/theme"
import { LauncherApp } from "./LauncherApp"

import { connectToGateway } from "@adaptive/hydra-platform"
import { noop } from "rxjs"
import { BrowserRouter, Route, Switch } from "react-router-dom"
import { ChildWindowFrame } from "@/OpenFin/Window/ChildWindowFrame"

export default function main() {
  if (!import.meta.env.VITE_MOCKS) {
    connectToGateway({
      url: `${window.location.origin}/ws`,
      interceptor: noop,
    })
  }

  ReactDOM.render(
    <StrictMode>
      <GlobalStyle />
      <ThemeProvider>
        <GlobalScrollbarStyle />
        <BrowserRouter basename={BASE_PATH}>
          <Switch>
            <Route
              path="/openfin-sub-window-frame"
              exact
              render={() => <ChildWindowFrame />}
            />
            <Route path="/" render={() => <LauncherApp />} />
          </Switch>
        </BrowserRouter>
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
    dimension1: "launcher",
    dimension2: "launcher",
    dimension3: import.meta.env,
    page: window.location.pathname,
  })

  ga("send", "pageview")
}
