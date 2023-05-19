import { StrictMode } from "react"
import { createRoot } from "react-dom/client"

import { GlobalScrollbarStyle, ThemeProvider } from "@/theme"
import GlobalStyle from "@/theme/globals"

import { GA_TRACKING_ID } from "./constants"
import { gaDimension, getMainApp } from "./main"
import {
  registerCreditBlotterUpdates,
  registerFxNotifications,
} from "./notifications"
import { initConnection } from "./services/connection"
import { checkTradingGatewayCompatibility } from "./services/tradingGatewayCompatibility"

const MainApp = getMainApp()

export async function initApp() {
  if (!import.meta.env.VITE_MOCKS) {
    initConnection()
  }

  checkTradingGatewayCompatibility()

  registerFxNotifications()
  registerCreditBlotterUpdates()

  const container = document.getElementById("root")
  const root = createRoot(container as HTMLElement)
  root.render(
    <StrictMode>
      <GlobalStyle />
      <ThemeProvider>
        <GlobalScrollbarStyle />
        <MainApp />
      </ThemeProvider>
    </StrictMode>,
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
