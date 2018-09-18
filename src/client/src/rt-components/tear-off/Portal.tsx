import React from 'react'
import { EnvironmentValue, withEnvironment } from 'rt-components'
import { withDefaultProps } from 'rt-util'
import { openBrowserWindow } from './BrowserWindow'
import { openDesktopWindow } from './DesktopWindow'
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
  } as WindowConfig,
  desktopConfig: {},
  browserConfig: { center: 'parent' as 'parent' | 'screen' },
}

export type PortalProps = typeof defaultPortalProps

class NewPortal extends React.Component<PortalProps & { environment: EnvironmentValue }> {
  externalWindow: Window | null = null
  mutationObserver: MutationObserver | null = null
  container = document.createElement('div')

  async componentDidMount() {
    const { environment, config, desktopConfig, browserConfig } = this.props

    if (environment.isDesktop) {
      const win = await openDesktopWindow({ ...config, ...desktopConfig })
      win.addEventListener('closed', this.release)
      this.externalWindow = win.getNativeWindow()
    } else {
      this.externalWindow = openBrowserWindow({ ...config, ...browserConfig })
    }
    this.externalWindow.addEventListener('beforeunload', this.release)
    window.addEventListener('beforeunload', this.release)
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

    window.removeEventListener('beforeunload', this.release)

    if (this.mutationObserver) {
      this.mutationObserver.disconnect()
    }
    if (onUnload) {
      onUnload.call(null)
    }
  }
}

export default withEnvironment(withDefaultProps(defaultPortalProps, NewPortal))
