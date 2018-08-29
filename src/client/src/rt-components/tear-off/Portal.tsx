import React from 'react'
import ReactDOM from 'react-dom'
import { EnvironmentValue, withEnvironment } from 'rt-components'
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

class NewPortal extends React.Component<PortalProps & { environment: EnvironmentValue }> {
  externalWindow: Window | null = null
  mutationObserver: MutationObserver | null = null

  container = document.createElement('div')

  componentWillUnmount() {
    if (this.externalWindow) {
      this.closeWindow()
    }
  }

  render() {
    const wrappedChildren = this.wrapChildrenWithPortal(this.props.children)
    return this.externalWindow ? ReactDOM.createPortal(wrappedChildren, this.container) : wrappedChildren
  }

  wrapChildrenWithPortal = (children: React.ReactNode) => {
    const { environment, config, desktopConfig, browserConfig } = this.props
    return environment.isDesktop ? (
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
    this.externalWindow.addEventListener('beforeunload', this.release)
    window.addEventListener('beforeunload', this.release)
    this.injectIntoWindow()
  }

  injectIntoWindow() {
    const { onBlock, title } = this.props

    if (this.externalWindow) {
      this.externalWindow.document.title = title

      const parentHead = document.head
      const childHead = this.externalWindow.document.head

      childHead.innerHTML = parentHead.innerHTML.replace(/\/static/g, window.location.href + 'static')
      this.externalWindow.document.title = title

      setTimeout(() => {
        this.externalWindow.document.body.appendChild(this.container)
      }, 200)

      this.forceUpdate()

      // Watch the parent head for changes in style tags
      // Required for emotion's dynamic styles
      this.mutationObserver = new MutationObserver(mutationsList => {
        mutationsList.forEach(mutationRecord => {
          const addedNode = mutationRecord.addedNodes[0]
          if (addedNode.nodeName === 'STYLE') {
            const newNode = addedNode.cloneNode(true)
            childHead.appendChild(newNode)
          }
        })
      })

      this.mutationObserver.observe(parentHead, { childList: true })
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
