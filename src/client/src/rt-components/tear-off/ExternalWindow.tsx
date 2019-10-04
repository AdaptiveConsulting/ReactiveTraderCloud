import { FC, useEffect } from 'react'
import { usePlatform, WindowConfig } from 'rt-components'
import { WindowCenterStatus } from './types'
import { useStore } from 'react-redux'

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
  const store = useStore()

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
      // Make store available to child windows
      // @ts-ignore
      window.__store__ = window.__store__ || store

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
