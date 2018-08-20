import React from 'react'
import ReactDOM from 'react-dom'
import { Environment, withEnvironment } from 'rt-components'
import { withDefaultProps } from 'rt-util'
import BrowserPortal from './BrowserPortal'
import DesktopPortal from './DesktopPortal'
import { WindowConfig } from './types'

const defaultPortalProps = {
  title: '',
  onBlock: null as () => void,
  onUnload: null as (region: string) => void,
  config: {
    name: '',
    url: '',
    width: 600,
    height: 640
  } as WindowConfig,
  desktopConfig: {},
  browserConfig: { center: 'parent' as 'parent' | 'screen' }
}

export type PortalProps = typeof defaultPortalProps

interface PortalState {
  mounted: boolean
}

class NewPortal extends React.Component<PortalProps & { environment: Environment }, PortalState> {
  private externalWindow: Window

  state = {
    mounted: false
  }

  container = document.createElement('div')

  componentDidMount() {
    this.setState({ mounted: true })
  }

  componentWillUnmount() {
    if (this.externalWindow) {
      this.closeWindow()
    }
  }

  render() {
    if (!this.state.mounted) {
      return false
    }

    return ReactDOM.createPortal(this.wrapChildrenWithPortal(this.props.children), this.container)
  }

  wrapChildrenWithPortal = (children: React.ReactNode) => {
    const { environment, config, desktopConfig, browserConfig } = this.props
    return environment.isRunningDesktop ? (
      <DesktopPortal createWindow={this.createWindow} closeWindow={this.closeWindow} {...config} {...desktopConfig}>
        {children}
      </DesktopPortal>
    ) : (
      <BrowserPortal createWindow={this.createWindow} {...config} {...browserConfig}>
        {children}
      </BrowserPortal>
    )
  }

  createWindow = (createdWindow: Window) => {
    this.externalWindow = createdWindow
    createdWindow.addEventListener('beforeunload', () => this.release())
    this.injectIntoWindow()
  }

  injectIntoWindow() {
    const { onBlock, title } = this.props

    if (this.externalWindow) {
      this.externalWindow.document.title = title

      const parentHead = document.head
      const childHead = this.externalWindow.document.head

      childHead.innerHTML = parentHead.innerHTML

      this.externalWindow.document.body.appendChild(this.container)

      // Watch the parent head for changes in style tags
      // Required for emotion's dynamic styles
      const observer = new MutationObserver(mutationsList => {
        mutationsList.forEach(mutationRecord => {
          const addedNode = mutationRecord.addedNodes[0]
          if (addedNode.nodeName === 'STYLE') {
            const newNode = addedNode.cloneNode(true)
            childHead.appendChild(newNode)
          }
        })
      })

      observer.observe(parentHead, { childList: true })
    } else {
      if (onBlock) {
        onBlock.call(null)
      } else {
        console.warn('A new window could not be opened. Maybe it was blocked.')
      }
    }
  }

  closeWindow = () => this.externalWindow.close()

  release = () => {
    const { onUnload } = this.props

    if (onUnload) {
      onUnload.call(null)
    }
  }
}

export default withEnvironment(withDefaultProps(defaultPortalProps, NewPortal))
