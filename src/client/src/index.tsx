import { initApp } from "./App"
import { browserUnsupported } from "./BrowserUnsupported"

if (!window.supportsBigInt) {
  browserUnsupported()
} else {
  initApp()
}