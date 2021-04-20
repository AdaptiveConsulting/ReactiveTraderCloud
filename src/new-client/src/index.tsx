import { StrictMode } from "react"
import ReactDOM from "react-dom"
import { App } from "./App/App"
import GlobalStyle from "./theme/globals"
import { GlobalScrollbarStyle, ThemeProvider } from "./theme"
import {
  register,
  requestNotificationPermission,
} from "./serviceWorkerRegistration"

if (import.meta.env.PROD) {
  register()
  requestNotificationPermission()
}

ReactDOM.render(
  <StrictMode>
    <GlobalStyle />
    <ThemeProvider>
      <GlobalScrollbarStyle />
      <App />
    </ThemeProvider>
  </StrictMode>,
  document.getElementById("root"),
)

declare global {
  interface Window {
    ga: any
  }
}

const { ga } = window
ga("create", {
  trackingId: "UA-46320965-5",
  transport: "beacon",
})
ga("set", {
  dimension1: "browser",
  dimension2: "browser",
  dimension3: import.meta.env,
  page: window.location.pathname,
})
ga("send", "pageview")
