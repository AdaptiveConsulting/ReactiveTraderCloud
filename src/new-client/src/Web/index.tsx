import { StrictMode } from "react"
import ReactDOM from "react-dom"
import GlobalStyle from "@/theme/globals"
import { GlobalScrollbarStyle, ThemeProvider } from "@/theme"
import { register } from "./serviceWorkerRegistration"
import { registerSwNotifications } from "./sw-notifications"
import { WebApp } from ".//WebApp"

import { AnalyticsCoreDeferred } from "@/App/Analytics"
import { LiveRatesCoreDeferred } from "@/App/LiveRates"
import { TradesCoreDeferred } from "@/App/Trades"

import { connectToGateway } from "@adaptive/hydra-platform"
import { noop } from "rxjs"

if (!import.meta.env.VITE_MOCKS) {
  connectToGateway({
    url: import.meta.env.VITE_HYDRA_URL as string,
    interceptor: noop,
    // useJson: true,
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
    <GlobalStyle />
    <ThemeProvider>
      <GlobalScrollbarStyle />
      <WebApp />
    </ThemeProvider>
  </StrictMode>,
  document.getElementById("root"),
)
