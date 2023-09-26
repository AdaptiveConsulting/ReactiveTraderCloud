import { broadcast } from "@finos/fdc3"

import { LimitCheckerHeader } from "@/client/App/Header/LimitCheckerHeader"

import { WindowControls } from "./WindowControls"
import { WindowFrameBase } from "./WindowFrameBase"

export const LimitCheckerWindowFrame = () => {
  const win = fin.Window.getCurrentSync()

  const headerControlHandlers = {
    close: () => {
      broadcast({
        type: "limit-checker-status",
        id: { isAlive: "false" },
      })
      win.close()
    },
    minimize: () => win.minimize(),
    maximize: () =>
      win
        .getState()
        .then((state) =>
          state === "maximized" ? win.restore() : win.maximize(),
        ),
  }
  return (
    <WindowFrameBase>
      <LimitCheckerHeader
        controls={<WindowControls {...headerControlHandlers} />}
      />
    </WindowFrameBase>
  )
}
