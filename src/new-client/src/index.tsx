import { init } from "./App"
import { browserUnsupported } from "./BrowserUnsupported"

// @ts-ignore
if (!window.supportsBigInt) {
  browserUnsupported()
} else {
  init()
}