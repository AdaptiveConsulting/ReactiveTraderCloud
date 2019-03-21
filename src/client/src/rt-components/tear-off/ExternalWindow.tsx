import { FC, useEffect, useState } from 'react'
import { usePlatform, WindowConfig } from 'rt-components'
import { WindowCenterStatus } from './types'
const defaultConfig: WindowConfig = {
  name: '',
  url: '',
  width: 600,
  height: 640,
  center: WindowCenterStatus.Parent,
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

  const [externalWindow, setWindow] = useState<Window>(null)

  if (externalWindow) {
    const newUrl: string = `${externalWindow.location.origin}${config.url}`
    if (externalWindow.location.href !== newUrl) {
      console.log(newUrl)
      externalWindow.location.replace(newUrl)
    }
  }

  useEffect(() => {
    let newWindow: Window

    const release = () => {
      if (externalWindow) {
        window.removeEventListener('beforeunload', release)
      }
      if (typeof onUnload === 'function') {
        onUnload.call(null)
      }
    }

    const getWindow = async () => {
      newWindow = await platform.window.open(config, release)
      if (newWindow) {
        window.addEventListener('beforeunload', release)
        setWindow(newWindow)
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
