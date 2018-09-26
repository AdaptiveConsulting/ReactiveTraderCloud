import React from 'react'
import { styled, Styled } from 'rt-theme'

declare const global: any

export interface LinkProps {
  is?: React.ComponentType<any>
  to: any
  [key: string]: any
}

const LinkRoot: Styled<{ onClick: any }> = styled.button`
  width: 100%;
  height: 100%;
  flex: 1 1 auto;
  font-size: 1.5rem;

  display: flex;
  align-items: center;
  justify-content: center;
  text-decoration: none;
  color: currentColor;
  position: relative;
  z-index: 100;

  &:hover {
    color: ${({ theme }) => theme.button.accent.backgroundColor};
  }
`

export class Link extends React.Component<any> {
  static defaultProps = {
    is: LinkRoot,
  }

  onClick = (event: MouseEvent) => {
    open(this.props.to)

    return false
  }

  render() {
    const { is: LinkElement, children } = this.props

    return <LinkElement onClick={this.onClick}>{children}</LinkElement>
  }
}

export async function open({ name, url, provider, provider: { options } }: any) {
  options = { name, url, ...options }

  // under openfin
  if (typeof fin !== 'undefined') {
    // open as url through openfin
    if (provider.platform === 'browser') {
      const res = fin.desktop.System.openUrlWithBrowser(url)
      console.log({ res })

      return res
    }
    // open new openfin application
    else if (provider.platform === 'openfin') {
      let app: any
      try {
        console.log('creating app')
        app = await createApp({
          ...options,
          defaultCentered: true,
          autoShow: true,
          shadow: true,
        })
      } catch (e) {
        console.log(e)
      }

      console.log({ app })

      try {
        console.log(
          /// run
          await new Promise((resolve, reject) => app.run(resolve, reject)),
        )
      } catch (e) {
        console.log(e)
      }

      return app
    }
  }
  // open as url
  else {
    global.open(url, name)
  }
}

export function createApp(options: any) {
  return new Promise((resolve, reject) => {
    const window: any = new fin.desktop.Application(
      {
        name: options.name,
        uuid: options.name,
        nonPersistent: false,
        mainWindowOptions: options,
      } as any,
      () => resolve(window),
      reject,
    )
  })
}

export function createWindow(options: any) {
  return new Promise((resolve, reject) => {
    const window: any = new fin.desktop.Window(
      {
        ...options,
        uuid: options.name,
        defaultCentered: true,
        autoShow: true,
        shadow: true,
      },
      () => resolve(window),
      reject,
    )
  })
}
