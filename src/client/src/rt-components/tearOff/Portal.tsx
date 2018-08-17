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
  private window: Window

  state = {
    mounted: false
  }

  container = document.createElement('div')

  componentDidMount() {
    this.setState({ mounted: true })
  }

  componentWillUnmount() {
    if (this.window) {
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

  createWindow = (window: Window) => {
    this.window = window
    this.injectIntoWindow()
  }

  injectIntoWindow() {
    const { onBlock, title } = this.props

    if (this.window) {
      this.window.document.title = title
      this.window.document.body.appendChild(this.container)

      setTimeout(() => copyStyles(document, this.window.document), 0)

      this.window.addEventListener('beforeunload', () => this.release())
    } else {
      if (onBlock) {
        onBlock.call(null)
      } else {
        console.warn('A new window could not be opened. Maybe it was blocked.')
      }
    }
  }

  closeWindow = () => this.window.close()

  release() {
    const { onUnload } = this.props

    if (onUnload) {
      onUnload.call(null)
    }
  }
}

function copyStyles(source: Document, target: Document) {
  Array.from(source.styleSheets).forEach((styleSheet: any) => {
    // For <style> elements
    let rules
    try {
      rules = styleSheet.cssRules
    } catch (err) {
      console.error(err)
    }
    if (rules) {
      const newStyleEl = source.createElement('style')

      // Write the text of each rule into the body of the style element
      Array.from(styleSheet.cssRules).forEach((cssRule: any) => {
        const { cssText, type } = cssRule
        let returnText = cssText
        // Check if the cssRule type is CSSImportRule (3) or CSSFontFaceRule (5) to handle local imports on a about:blank page
        // '/custom.css' turns to 'http://my-site.com/custom.css'
        if ([3, 5].includes(type)) {
          returnText = cssText
            .split('url(')
            .map(line => {
              if (line[1] === '/') {
                return `${line.slice(0, 1)}${window.location.origin}${line.slice(1)}`
              }
              return line
            })
            .join('url(')
        }
        newStyleEl.appendChild(source.createTextNode(returnText))
      })

      target.head.appendChild(newStyleEl)
    } else if (styleSheet.href) {
      // for <link> elements loading CSS from a URL
      const newLinkEl = source.createElement('link')

      newLinkEl.rel = 'stylesheet'
      newLinkEl.href = styleSheet.href
      target.head.appendChild(newLinkEl)
    }
  })
}

export default withEnvironment(withDefaultProps(defaultPortalProps, NewPortal))
