import React from 'react'
import { PlatformAdapter, withPlatform } from 'rt-components'
import { withDefaultProps } from 'rt-util'
import { WindowConfig } from './types'

const defaultPortalProps = {
  title: '',
  tileView: '', //TODO ML 08/01/2019 might remove this one
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
    const { config, platform, tileView } = this.props
    //TODO ML 08/01/2019 think of ways you can improve on this one
    const url = tileView.length > 0 ? config.url + '?tileView=' + tileView : config.url
    const newConfig = { ...config, url }
    this.externalWindow = await platform.window.open(newConfig, this.release)

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
    return <React.Fragment>{null}</React.Fragment>
  }

  closeWindow = () => this.externalWindow.close()

  release = () => {
    const { onUnload } = this.props

    if (this.externalWindow) {
      window.removeEventListener('beforeunload', this.release)
    }

    if (this.mutationObserver) {
      this.mutationObserver.disconnect()
    }
    if (onUnload) {
      onUnload.call(null)
    }
  }
}

export default withPlatform(withDefaultProps(defaultPortalProps, NewPortal))
