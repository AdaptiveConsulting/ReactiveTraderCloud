import { StrictMode } from "react"
import ReactDOM from "react-dom"
import GlobalStyle from "@/theme/globals"
import { GlobalScrollbarStyle, ThemeProvider } from "@/theme"
import { registerNotifications } from "./notifications"
import { GA_TRACKING_ID } from "./constants"
import { getMainApp, gaDimension } from "./main"
import { initConnection } from "./services/connection"

const MainApp = getMainApp()

async function init() {
  if (!import.meta.env.VITE_MOCKS) {
    initConnection()
  }

  registerNotifications()

  ReactDOM.render(
    <StrictMode>
      <GlobalStyle />
      <ThemeProvider>
        <GlobalScrollbarStyle />
        <MainApp />
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
    dimension1: gaDimension,
    dimension2: gaDimension,
    dimension3: import.meta.env,
    page: window.location.pathname,
  })

  ga("send", "pageview")
}

init()
