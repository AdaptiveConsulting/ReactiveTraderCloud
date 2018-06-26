import * as React from 'react'
import * as ReactDOM from 'react-dom'
import { Environment, withEnvironment } from '../shell/EnvironmentProvider'

const defaultPortalProps = {
  name: '',
  title: '',
  url: '',
  width: 600,
  height: 640,
  center: 'parent' as 'parent' | 'screen',
  onBlock: null as () => void,
  onUnload: null as () => void
}

export type PortalProps = typeof defaultPortalProps

const initialState = { mounted: false }

type PortalState = Readonly<typeof initialState>

class NewPortal extends React.Component<Partial<PortalProps> & { environment: Environment }, PortalState> {
  private container: HTMLDivElement
  private window: Window

  constructor(props) {
    super(props)
    this.container = document.createElement('div')
    this.state = {
      mounted: false
    }
  }

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
    const { environment, ...props } = this.props
    const PortalManager = environment.PortalManager

    const element = (
      <PortalManager createWindow={this.createWindow} closeWindow={this.closeWindow} {...props}>
        {this.props.children}
      </PortalManager>
    )

    return ReactDOM.createPortal(element, this.container)
  }

  createWindow = window => {
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

export const Portal = withEnvironment(NewPortal)
