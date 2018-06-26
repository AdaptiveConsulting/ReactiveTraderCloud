import * as React from 'react'
import OpenFinChrome from '../shell/OpenFinChrome'
export interface DesktopWindowProps {
  createWindow: (Window) => void
  closeWindow: () => void
  name: string
  width: number
  height: number
  url: string
}

export class DesktopWindow extends React.PureComponent<Partial<DesktopWindowProps>> {
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
