import * as React from 'react'
import OpenFinChrome from '../shell/OpenFinChrome'
import { withDefaultProps } from '../utils/reactTypes'

export const defaultDesktopProps = {
  name: '',
  url: '',
  width: 600,
  height: 640,
  createWindow: null as (Window) => void,
  closeWindow: null as () => void
}

type DesktopWindowProps = typeof defaultDesktopProps

class DesktopWindow extends React.PureComponent<DesktopWindowProps> {
  async componentDidMount() {
    this.props.createWindow(await this.openChild())
    this.forceUpdate()
  }

  render() {
    return (
      <OpenFinChrome showHeaderBar={false} close={this.props.closeWindow}>
        {this.props.children}
      </OpenFinChrome>
    )
  }

  openChild() {
    const { url, name, width, height } = this.props

    return new Promise(resolve => {
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
          resolve(win.getNativeWindow())
        },
        error => {
          console.log('Error creating window:', error)
        }
      )
    })
  }
}

export default withDefaultProps(defaultDesktopProps, DesktopWindow)
