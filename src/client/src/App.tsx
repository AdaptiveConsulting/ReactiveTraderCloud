import { GlobalScrollbarStyle, ThemeProvider } from "@/theme"
import GlobalStyle from "@/theme/globals"
import { StrictMode } from "react"
import ReactDOM from "react-dom"
import { GA_TRACKING_ID } from "./constants"
import { IncompatibilityModal } from "./IncompatibilityModal"
import { gaDimension, getMainApp } from "./main"
import { registerNotifications } from "./notifications"
import { initConnection } from "./services/connection"
import { checkTradingGatewayCompatibility } from "./services/tradingGatewayCompatibility"

const MainApp = getMainApp()

export async function initApp() {
  if (!import.meta.env.VITE_MOCKS) {
    initConnection()
  }
  const { isCompatible, incompatibilityReasons } =
    await checkTradingGatewayCompatibility()

  registerNotifications()

  ReactDOM.render(
    <StrictMode>
      <GlobalStyle />
      <ThemeProvider>
        <GlobalScrollbarStyle />
        <IncompatibilityModal
          isCompatible={isCompatible}
          reasons={incompatibilityReasons}
        />
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
