import React from 'react'
import { PlatformAdapter, withPlatform, WindowConfig } from 'rt-components'
import { withDefaultProps } from 'rt-util'
import { WindowCenterStatus } from './types'

const defaultConfig: WindowConfig = {
  name: '',
  url: '',
  width: 600,
  height: 640,
  center: WindowCenterStatus.Parent,
}

export interface ExternalWindowProps {
  title: string
  onBlock: () => void
  onUnload: () => void
  config: WindowConfig
}

const defaultWindowProps: ExternalWindowProps = {
  title: '',
  onBlock: null as () => void,
  onUnload: null as () => void,
  config: defaultConfig,
}

class ExternalWindow extends React.Component<ExternalWindowProps & { platform: PlatformAdapter }> {
  externalWindow: Window | null = null

  async componentDidMount() {
    const { config, platform } = this.props

    this.externalWindow = await platform.window.open(config, this.release)

    if (this.externalWindow) {
      window.addEventListener('beforeunload', this.release)
    }
  }

  componentWillUnmount() {
    if (this.externalWindow) {
      this.closeWindow()
    }
  }

  render() {
    return null as JSX.Element
  }

  closeWindow = () => this.externalWindow.close()

  release = () => {
    const { onUnload } = this.props
    if (this.externalWindow) {
      window.removeEventListener('beforeunload', this.release)
    }
    onUnload.call(null)
  }
}

export default withPlatform(withDefaultProps(defaultWindowProps, ExternalWindow))
