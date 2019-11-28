import { FC, useEffect } from 'react'
import { PlatformWindow, usePlatform, WindowConfig } from 'rt-platforms'
import { WindowCenterStatus } from './types'

const defaultConfig: WindowConfig = {
  name: '',
  url: '',
  width: 600,
  height: 640,
  center: WindowCenterStatus.Parent,
  x: 0,
  y: 0,
}

export interface ExternalWindowProps {
  title?: string
  onBlock?: () => void
  onUnload: () => void
  config?: WindowConfig
}

const ExternalWindow: FC<ExternalWindowProps> = ({
  title = '',
  onBlock = () => undefined,
  onUnload = () => undefined,
  config = defaultConfig,
}) => {
  const platform = usePlatform()

  useEffect(() => {
    let externalWindow: PlatformWindow | undefined

    const release = () => {
      if (externalWindow) {
        window.removeEventListener('beforeunload', release)
      }
      if (typeof onUnload === 'function') {
        onUnload.call(null)
      }
    }

    const getWindow = async () => {
      externalWindow = await platform.window.open(config, release)
      if (externalWindow) {
        window.addEventListener('beforeunload', release)
      }
    }

    getWindow()

    return () => {
      if (externalWindow) {
        externalWindow.close()
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return null
}

export default ExternalWindow
