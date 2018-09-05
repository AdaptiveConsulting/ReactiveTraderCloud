import { DesktopWindowConfig, WindowConfig } from './types'

type DesktopWindowProps = WindowConfig & DesktopWindowConfig

export const openDesktopWindow = (config: DesktopWindowProps) => {
  const { url, name, width: defaultWidth, height: defaultHeight } = config

  return new Promise<Window>(resolve => {
    const win = new fin.desktop.Window(
      {
        name,
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
