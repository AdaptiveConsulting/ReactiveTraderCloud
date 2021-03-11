import { StrictMode } from "react"
import ReactDOM from "react-dom"
import { App } from "./App/App"
import GlobalStyle from "./theme/globals"
import { GlobalScrollbarStyle, ThemeProvider } from "./theme"

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
