import { useEffect } from "react"
import { WindowBody } from "./WindowBody"
import { WindowFooter } from "./WindowFooter"
import { WindowHeader } from "./WindowHeader"
import { WindowViewport } from "./WindowViewport"
import { FrameRoot } from "./WindowFrame.styles"

export const WindowFrame: React.FC = () => {
  const win = fin.Window.getCurrentSync()

  const headerControlHandlers = {
    close: () => win.close(),
    minimize: () => win.minimize(),
    maximize: () =>
      win
        .getState()
        .then((state) =>
          state === "maximized" ? win.restore() : win.maximize(),
        ),
  }

  useEffect(() => {
    fin.Platform.Layout.init({
      containerId: "layout-container",
    })
  }, [])

  return (
    <FrameRoot>
      <WindowViewport>
        <WindowHeader {...headerControlHandlers} title="Reactive Trader®" />
        <WindowBody />
        <WindowFooter />
      </WindowViewport>
    </FrameRoot>
  )
}
