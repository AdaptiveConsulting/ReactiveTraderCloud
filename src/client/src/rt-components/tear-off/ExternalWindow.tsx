import { FC, useEffect } from 'react'
import { usePlatform, WindowConfig } from 'rt-platforms'
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
  onBlock = null as () => void,
  onUnload = null as () => void,
  config = defaultConfig,
}) => {
  const platform = usePlatform()

  useEffect(() => {
    let externalWindow: Window

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
  }, [])

  return null
}

export default ExternalWindow
