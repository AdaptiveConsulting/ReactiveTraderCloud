import { StrictMode } from "react"
import { createRoot } from "react-dom/client"

import { ThemeProvider } from "@/client/theme"
import GlobalStyle from "@/client/theme/globals"

import { Modal } from "./components/Modal"

export function browserUnsupported() {
  const container = document.getElementById("root")
  const root = createRoot(container!)
  root.render(
    <StrictMode>
      <ThemeProvider>
        <GlobalStyle />
        <Modal
          title="Sorry, but it appears your browser version is not supported"
          shouldShow
        >
          <p></p>
          <p>
            Reactive Trader supports the latest versions of Chrome, Firefox,
            Safari and Edge browsers.
          </p>
        </Modal>
      </ThemeProvider>
    </StrictMode>,
  )
}
