import { useEffect } from "react"

import { WindowBody } from "./WindowBody"
import { WindowFooter } from "./WindowFooter"
import { FrameRoot } from "./WindowFrame.styles"
import { WindowHeader } from "./WindowHeader"
import { WindowViewport } from "./WindowViewport"

export const WindowFrame = ({ admin }: { admin: boolean }) => {
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
        <WindowHeader
          admin={admin}
          {...headerControlHandlers}
          title="Reactive Trader®"
        />
        <WindowBody />
        <WindowFooter />
      </WindowViewport>
    </FrameRoot>
  )
}
