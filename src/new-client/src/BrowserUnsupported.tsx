import { StrictMode } from "react"
import ReactDOM from "react-dom"
import GlobalStyle from "@/theme/globals"
import { GlobalScrollbarStyle, ThemeProvider } from "@/theme"
import { Modal } from "./components/Modal"

export function browserUnsupported() {
  ReactDOM.render(
    <StrictMode>
      <GlobalStyle />
      <ThemeProvider>
        <GlobalScrollbarStyle />
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
    document.getElementById("root"),
  )
}