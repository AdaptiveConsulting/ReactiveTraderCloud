import { FC, useEffect } from 'react'
import { usePlatform, WindowConfig } from 'rt-components'
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
  defaultNotional?: string
  returnNotional: (notional: string) => void
}

const ExternalWindow: FC<ExternalWindowProps> = ({   
  title = '',
  onBlock = null as () => void,
  onUnload = null as () => void,
  config = defaultConfig,
  defaultNotional,
  returnNotional
}) => {
  const platform = usePlatform()

  useEffect(() => {
    let externalWindow: Window

    const release = () => {
      if (externalWindow) {
        window.removeEventListener('beforeunload', release)
        returnNotional(externalWindow.DEFAULT_NOTIONAL)
      }
      if (typeof onUnload === 'function') {
        onUnload.call(null)
      }
    }

    const getWindow = async () => {
      externalWindow = await platform.window.open(config, release)
      if (externalWindow) {
        window.addEventListener('beforeunload', release)
        externalWindow.DEFAULT_NOTIONAL = defaultNotional
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
