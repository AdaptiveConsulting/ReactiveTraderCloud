import { PropsWithChildren, useEffect } from "react"

import { WindowBody } from "./WindowBody"
import { WindowFooter } from "./WindowFooter"
import { FrameRoot } from "./WindowFrame.styles"
import { WindowViewport } from "./WindowViewport"

export const WindowFrameBase = ({ children }: PropsWithChildren) => {
  useEffect(() => {
    fin.Platform.Layout.init({
      containerId: "layout-container",
    })
  }, [])

  return (
    <FrameRoot>
      <WindowViewport>
        {children}
        <WindowBody />
        <WindowFooter />
      </WindowViewport>
    </FrameRoot>
  )
}
