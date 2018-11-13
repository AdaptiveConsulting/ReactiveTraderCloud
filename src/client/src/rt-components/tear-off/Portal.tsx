import React from 'react'
import { PlatformAdapter, withPlatform } from 'rt-components'
import { withDefaultProps } from 'rt-util'
import { WindowConfig } from './types'

const defaultPortalProps = {
  title: '',
  onBlock: null as () => void,
  onUnload: null as (region: string) => void,
  config: {
    name: '',
    url: '',
    width: 600,
    height: 640,
    center: 'parent' as 'parent' | 'screen',
  } as WindowConfig,
}

export type PortalProps = typeof defaultPortalProps

class NewPortal extends React.Component<PortalProps & { platform: PlatformAdapter }> {
  externalWindow: Window | null = null
  mutationObserver: MutationObserver | null = null
  container = document.createElement('div')

  async componentDidMount() {
    const { config, platform } = this.props

    this.externalWindow = await platform.window.open(config)

    if (this.externalWindow) {
      platform.window.onClose!(this.externalWindow, this.release)
      platform.window.onClose!(window, this.release)
    }
  }

  componentWillUnmount() {
    if (this.externalWindow) {
      this.closeWindow()
    }
  }

  render() {
    return <React.Fragment>{null}</React.Fragment>
  }

  closeWindow = () => this.externalWindow.close()

  release = () => {
    const { onUnload } = this.props
    console.log('YAAAAAAAAYYY')

    if (this.mutationObserver) {
      this.mutationObserver.disconnect()
    }
    if (onUnload) {
      onUnload.call(null)
    }
  }
}

export default withPlatform(withDefaultProps(defaultPortalProps, NewPortal))
