import { StrictMode } from "react"
import { createRoot } from "react-dom/client"

import { ENVIRONMENT } from "@/constants"
import { GlobalScrollbarStyle, ThemeProvider } from "@/theme"
import GlobalStyle from "@/theme/globals"

import { getMainApp } from "./main"
import {
  registerCreditAcceptedNotifications,
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
  registerCreditAcceptedNotifications()

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

  window.gtag("js", new Date())
  window.gtag(
    "config",
    ENVIRONMENT === "prod" ? "G-Z3PC9MRCH9" : "G-Y28QSEPEC8",
  )
}
