import { WindowConfig } from '../types'

type DesktopWindowProps = WindowConfig

const generateRandomName = function() {
  let text = ''
  const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'

  for (let i = 0; i < 15; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length))
  }

  return text
}

export const openDesktopWindow = (
  config: DesktopWindowProps,
  onClose?: () => void,
  position?: {},
) => {
  const { url, width: defaultWidth, height: defaultHeight } = config

  return new Promise<Window>(resolve => {
    const win = new fin.desktop.Window(
      {
        name: config.name || generateRandomName(),
        url,
        defaultWidth,
        defaultHeight,
        defaultCentered: true,
        autoShow: true,
        frame: false,
        saveWindowState: false,
        shadow: true,
        ...position,
      } as any, // any needed because OpenFin does not have correct typings for WindowOptions @kdesai
      () => {
        if (onClose) {
          win.addEventListener('closed', onClose)
        }
        resolve(win.getNativeWindow())
      },
      error => {
        console.log('Error creating window:', error)
      },
    )
  })
}
