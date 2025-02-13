import { StrictMode } from "react"
import { createRoot } from "react-dom/client"

import { initConnection } from "@/services/connection"
import { checkTradingGatewayCompatibility } from "@/services/tradingGatewayCompatibility"

import { ENVIRONMENT } from "./constants"
import { getMainApp } from "./main"
import { GlobalStyle, ThemeProvider } from "./theme"

const MainApp = getMainApp()

export async function initApp() {
  if (!import.meta.env.VITE_MOCKS) {
    initConnection()
  }

  checkTradingGatewayCompatibility()

  const container = document.getElementById("root")
  const root = createRoot(container as HTMLElement)

  root.render(
    <StrictMode>
      <ThemeProvider>
        <GlobalStyle />
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
