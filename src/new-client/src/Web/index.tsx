import { GA_TRACKING_ID } from "../constants"
import { StrictMode, Suspense } from "react"
import ReactDOM from "react-dom"
import GlobalStyle from "@/theme/globals"
import { GlobalScrollbarStyle, ThemeProvider } from "@/theme"
import { register } from "./serviceWorkerRegistration"
import { registerSwNotifications } from "./sw-notifications"
import { WebApp } from ".//WebApp"
import { StyleguideRoute } from ".//StyleguideRoute"

import { AnalyticsCoreDeferred } from "@/App/Analytics"
import { LiveRatesCoreDeferred } from "@/App/LiveRates"
import { TradesCoreDeferred } from "@/App/Trades"

import { connectToGateway } from "@adaptive/hydra-platform"
import { noop } from "rxjs"
import { PlatformContext } from "@/platform"

import { BrowserRouter, Route, Switch } from "react-router-dom"

export default function main() {
  if (!import.meta.env.VITE_MOCKS) {
    connectToGateway({
      url: `${window.location.origin}/ws`,
      interceptor: noop,
      useJson: true,
      autoReconnect: true,
    })
  }

  if (import.meta.env.PROD) {
    register({
      onUpdate: (registration) => {
        // If the SW got updated, then we have to be careful. We can't immediately
        // skip the waiting phase, because if there are requests on the fly that
        // could be a disaster. In an ideal world we should display a message to
        // the user letting them know that a new version is available and whenever
        // the user confirms that they want to update then we can skip the waiting
        // phase and we reload the App. However, before we implement that feature
        // what we can do is to skip the waiting phase after all the async chunks
        // have been loaded. This is only an option because all our async chunks
        // get always preloaded from the main chunk.
        Promise.all([
          AnalyticsCoreDeferred,
          LiveRatesCoreDeferred,
          TradesCoreDeferred,
        ]).then(() => {
          registration.waiting?.postMessage({ type: "SKIP_WAITING" })
        })
      },
    })
    registerSwNotifications()
  }

  ReactDOM.render(
    <StrictMode>
      <PlatformContext.Provider value={{ type: "web" }}>
        <GlobalStyle />
        <BrowserRouter>
          <ThemeProvider>
            <GlobalScrollbarStyle />
            <Suspense fallback={<div />}>
              <Switch>
                <Route
                  path={"/styleguide"}
                  render={() => <StyleguideRoute />}
                />
                <Route render={() => <WebApp />} />
              </Switch>
            </Suspense>
          </ThemeProvider>
        </BrowserRouter>
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
    dimension1: "browser",
    dimension2: "browser",
    dimension3: import.meta.env,
    page: window.location.pathname,
  })

  ga("send", "pageview")
}
