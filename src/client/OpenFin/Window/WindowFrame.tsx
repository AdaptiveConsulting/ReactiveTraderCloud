import { WindowFrameBase } from "./WindowFrameBase"
import { WindowHeader } from "./WindowHeader"

export const WindowFrame = () => {
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

  return (
    <WindowFrameBase>
      <WindowHeader {...headerControlHandlers} title="Reactive Trader®" />
    </WindowFrameBase>
  )
}
