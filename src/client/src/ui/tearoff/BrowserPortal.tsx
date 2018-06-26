import * as React from 'react'

interface WindowFeatures {
  width?: number
  height?: number
  left?: number
  top?: number
}

export interface BrowserWindowProps {
  createWindow: (Window) => void
  name: string
  width: number
  height: number
  center: string
  url: string
}

export class BrowserWindow extends React.PureComponent<Partial<BrowserWindowProps>> {
  componentDidMount() {
    this.props.createWindow(this.openChild())
  }

  render() {
    return this.props.children
  }

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

    return window.open(
      url,
      name,
      toWindowFeatures({
        width,
        height,
        left,
        top
      })
    )
  }
}

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
