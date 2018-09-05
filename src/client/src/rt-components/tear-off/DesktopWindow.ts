import { DesktopWindowConfig, WindowConfig } from './types'

type DesktopWindowProps = WindowConfig & DesktopWindowConfig

const generateRandomName = function() {
  let text = ''
  const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'

  for (let i = 0; i < 15; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length))
  }

  return text
}

export const openDesktopWindow = (config: DesktopWindowProps) => {
  const { url, width: defaultWidth, height: defaultHeight } = config

  return new Promise<Window>(resolve => {
    const win = new fin.desktop.Window(
      {
        name: generateRandomName(),
        url,
        defaultWidth,
        defaultHeight,
        defaultCentered: true,
        autoShow: true,
        frame: false,
        saveWindowState: false
      },
      () => {
        resolve(win.getNativeWindow())
      },
      error => {
        console.log('Error creating window:', error)
      }
    )
  })
}
