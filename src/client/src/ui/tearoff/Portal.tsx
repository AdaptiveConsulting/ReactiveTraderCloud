import * as React from 'react'
import * as ReactDOM from 'react-dom'
import { EnvironmentConsumer } from '../../main'
import OpenFinChrome from '../shell/OpenFinChrome'

interface WindowFeatures {
  width?: number
  height?: number
  left?: number
  top?: number
}

const defaultPortalProps = {
  name: '',
  title: '',
  url: '',
  width: 600,
  height: 640,
  center: 'parent' as 'parent' | 'screen',
  onBlock: null as () => void,
  onUnload: null as () => void,
  onDesktop: false
}

export type PortalProps = typeof defaultPortalProps

const initialState = { mounted: false }

type PortalState = Readonly<typeof initialState>

export const Portal: React.SFC<Partial<PortalProps>> = portalProps => (
  <EnvironmentConsumer>
    {isRunningOnDesktop =>
      isRunningOnDesktop ? <DesktopWindow {...portalProps} /> : <BrowserWindow {...portalProps} />
    }
  </EnvironmentConsumer>
)

class BrowserWindow extends React.PureComponent<Partial<PortalProps>, PortalState> {
  private container: HTMLDivElement
  private window: Window

  constructor(props) {
    super(props)
    this.container = document.createElement('div')
    this.state = {
      mounted: false
    }
  }

  render() {
    if (!this.state.mounted) {
      return false
    }

    return ReactDOM.createPortal(this.props.children, this.container)
  }

  componentDidMount() {
    this.openChild()
    this.setState({ mounted: true })
  }

  /**
   * Create the new window when NewWindow component mount.
   */
  openChild() {
    const { name, width, height, center, url } = this.props

    let left = 0
    let top = 0

    if (center === 'parent') {
      left = window.top.outerWidth / 2 + window.top.screenX - width / 2
      top = window.top.outerHeight / 2 + window.top.screenY - height / 2
    } else if (center === 'screen') {
      const screenLeft = window.screenLeft
      const screenTop = window.screenTop

      const windowWidth = window.innerWidth
        ? window.innerWidth
        : document.documentElement.clientWidth
          ? document.documentElement.clientWidth
          : screen.width
      const windowHeight = window.innerHeight
        ? window.innerHeight
        : document.documentElement.clientHeight
          ? document.documentElement.clientHeight
          : screen.height

      left = windowWidth / 2 - width / 2 + screenLeft
      top = windowHeight / 2 - height / 2 + screenTop
    }

    this.window = window.open(
      url,
      name,
      toWindowFeatures({
        width,
        height,
        left,
        top
      })
    )
    this.injectIntoWindow()
  }

  injectIntoWindow() {
    const { onBlock, title } = this.props
    // Check if the new window was succesfully opened.
    if (this.window) {
      this.window.document.title = title
      this.window.document.body.appendChild(this.container)

      // Update component to allow event handlers
      this.forceUpdate()

      // If specified, copy styles from parent window's document.

      setTimeout(() => copyStyles(document, this.window.document), 0)

      // Release anything bound to this component before the new window unload.
      this.window.addEventListener('beforeunload', () => this.release())
    } else {
      // Handle error on opening of new window.
      if (onBlock) {
        onBlock.call(null)
      } else {
        console.warn('A new window could not be opened. Maybe it was blocked.')
      }
    }
  }

  closeWindow = () => this.window.close()

  /**
   * Close the opened window (if any) when NewWindow will unmount.
   */
  componentWillUnmount() {
    if (this.window) {
      this.closeWindow()
    }
  }

  /**
   * Release the new window and anything that was bound to it.
   */
  release() {
    // Call any function bound to the `onUnload` prop.
    const { onUnload } = this.props

    if (onUnload) {
      onUnload.call(null)
    }
  }
}

class DesktopWindow extends React.PureComponent<Partial<PortalProps>, PortalState> {
  private container: HTMLDivElement
  private window: Window

  constructor(props) {
    super(props)
    this.container = document.createElement('div')
    this.state = {
      mounted: false
    }
  }

  render() {
    if (!this.state.mounted) {
      return false
    }

    return ReactDOM.createPortal(
      <OpenFinChrome showHeaderBar={false} close={this.closeWindow}>
        {this.props.children}
      </OpenFinChrome>,
      this.container
    )
  }

  componentDidMount() {
    this.openChild()
    this.setState({ mounted: true })
  }

  /**
   * Create the new window when NewWindow component mount.
   */
  openChild() {
    const { url, name, width, height } = this.props

    const win = new fin.desktop.Window(
      {
        name,
        url,
        defaultCentered: true,
        defaultWidth: width,
        defaultHeight: height,
        autoShow: true,
        frame: false,
        saveWindowState: false
      },
      () => {
        this.window = win.getNativeWindow()
        this.injectIntoWindow()
      },
      error => {
        console.log('Error creating window:', error)
      }
    )
  }

  injectIntoWindow() {
    const { onBlock, title } = this.props
    // Check if the new window was succesfully opened.
    if (this.window) {
      this.window.document.title = title
      this.window.document.body.appendChild(this.container)

      // Update component to allow event handlers
      this.forceUpdate()

      // If specified, copy styles from parent window's document.

      setTimeout(() => copyStyles(document, this.window.document), 0)

      // Release anything bound to this component before the new window unload.
      this.window.addEventListener('beforeunload', () => this.release())
    } else {
      // Handle error on opening of new window.
      if (onBlock) {
        onBlock.call(null)
      } else {
        console.warn('A new window could not be opened. Maybe it was blocked.')
      }
    }
  }

  closeWindow = () => this.window.close()

  /**
   * Close the opened window (if any) when NewWindow will unmount.
   */
  componentWillUnmount() {
    if (this.window) {
      this.closeWindow()
    }
  }

  /**
   * Release the new window and anything that was bound to it.
   */
  release() {
    // Call any function bound to the `onUnload` prop.
    const { onUnload } = this.props

    if (onUnload) {
      onUnload.call(null)
    }
  }
}

/**
 * Copy styles from a source document to a target.
 */

//util
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

/**
 * Convert features props to window features format (name=value,other=value).
 */

//browser window manager
function toWindowFeatures(windowFeatures: WindowFeatures) {
  return Object.keys(windowFeatures)
    .reduce<string[]>((features, name) => {
      const value = windowFeatures[name]
      if (typeof value === 'boolean') {
        features.push(`${name}=${value ? 'yes' : 'no'}`)
      } else {
        features.push(`${name}=${value}`)
      }
      return features
    }, [])
    .join(',')
}
