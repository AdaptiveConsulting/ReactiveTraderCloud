import logger, { DebugType } from 'logger'
import { WindowConfig } from './types'

type DesktopWindowProps = WindowConfig

const LOG_NAME = 'DesktopWindow:'
const errorLogger = logger.error(LOG_NAME, DebugType.Error)

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

  return new Promise<fin.OpenFinWindow>(resolve => {
    const win = new fin.desktop.Window(
      {
        name: generateRandomName(),
        url,
        defaultWidth,
        defaultHeight,
        defaultCentered: true,
        autoShow: true,
        frame: false,
        saveWindowState: false,
        shadow: true,
      } as any, // any needed because OpenFin does not have correct typings for WindowOptions @kdesai
      () => {
        resolve(win)
      },
      error => {
        errorLogger('creating window:', error)
      },
    )
  })
}
