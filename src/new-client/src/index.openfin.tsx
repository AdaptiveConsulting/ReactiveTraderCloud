import { StrictMode } from "react"
import ReactDOM from "react-dom"
import { OpenFinApp } from "./OpenFin/OpenFinApp"
import GlobalStyle from "./theme/globals"
import { GlobalScrollbarStyle, ThemeProvider } from "./theme"

ReactDOM.render(
  <StrictMode>
    <GlobalStyle />
    <ThemeProvider>
      <GlobalScrollbarStyle />
      <OpenFinApp />
    </ThemeProvider>
  </StrictMode>,
  document.getElementById("root"),
)
