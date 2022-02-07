import { useEffect, useState } from "react"
import { ChildWindowHeader } from "./ChildWindowHeader"
import { FrameRoot } from "./ChildWindowFrame.styles"
import { WindowBody } from "./WindowBody"
import { WindowViewport } from "./WindowViewport"
import { getAppName, getPlatformLayoutTitle } from "../utils/app"

export const ChildWindowFrame: React.FC = () => {
  const win = fin.Window.getCurrentSync()
  const [windowName, setWindowName] = useState("")

  const headerControlHandlers = {
    minimize: () => win.minimize(),
    popIn: windowName !== "" ? () => win.close() : undefined,
    close: windowName === "" ? () => win.close() : undefined,
  }

  useEffect(() => {
    window.document.dispatchEvent(
      new Event("DOMContentLoaded", {
        bubbles: true,
        cancelable: true,
      }),
    )
    async function init() {
      async function updateWindowName() {
        const windowTitle = await getPlatformLayoutTitle()
        if (windowTitle) {
          setWindowName(windowTitle)
        }
      }
      await fin.Platform.Layout.init()

      // This seems to be necessary to give OpenFin Platform enough time to initialise
      // Otherwise the layout can"t be found...
      setTimeout(updateWindowName, 0)
    }
    init()
  }, [])

  const title = `${getAppName()}${windowName ? ` - ${windowName}` : ""}`

  return (
    <FrameRoot>
      <WindowViewport>
        <ChildWindowHeader {...headerControlHandlers} title={title} />
        <WindowBody />
      </WindowViewport>
    </FrameRoot>
  )
}
