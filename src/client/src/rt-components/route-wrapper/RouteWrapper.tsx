import React, { ReactNode, useEffect, useState } from 'react'
import styled from 'styled-components/macro'
import { Platform, usePlatform, isParentAppOpenfinLauncher } from 'rt-platforms'
import { getAppName } from 'rt-util'
import { useTheme, ThemeName } from 'rt-theme'
import Helmet from 'react-helmet'

const RouteStyle = styled('div')<{ platform: Platform }>`
  width: 100%;
  background-color: ${({ theme }) => theme.core.darkBackground};
  overflow: hidden;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: center;
  user-select: none;

  /* When in Finsemble a 25px header is injected,
   this resets body to the correct height */
  height: ${({ platform: { style } }) => style.height};
`

type WindowRole = 'main' | 'sub'
interface SymbolParamObject {
  symbol: string
}

interface RouteWrapperProps {
  children: ReactNode
  windowType?: WindowRole
  title?: string | SymbolParamObject
}

// TODO Move to openfin-platform
//@ts-ignore
const isChildView = window.fin && window.fin.me && window.fin.me.isView

const RouteWrapper: React.FC<RouteWrapperProps> = props => {
  const { children, windowType = 'main', title } = props
  const [fromLauncher, setFromLauncher] = useState<boolean>(false)
  const platform = usePlatform()
  const theme = useTheme()

  const { PlatformHeader, PlatformFooter, PlatformControls, PlatformRoute, window } = platform

  useEffect(() => {
    isParentAppOpenfinLauncher()
      .then(isLauncher => {
        setFromLauncher(isLauncher)
      })
      .catch(() => {
        console.error('Cannot find parent window')
      })
  }, [])

  useEffect(() => {
    const head = document.getElementById('themeColor')
    head &&
      head.setAttribute(
        'content',
        theme.themeName === ThemeName.Dark ? 'rgb(40, 46, 57)' : 'rgb(249, 249, 249)'
      )
  }, [theme])

  const isBlotterOrTrade = title === 'Trades' || title === 'Live Rates'

  const Header = windowType === 'main' ? PlatformControls : null
  const Footer = windowType === 'main' ? PlatformFooter : null

  const subheader =
    windowType === 'sub' && !isChildView ? (
      <PlatformHeader
        close={fromLauncher && window.close}
        popIn={!fromLauncher && window.close}
        minimize={window.minimize}
        title={`${getAppName()} - ${title}`}
        isBlotterOrTrade={isBlotterOrTrade}
      />
    ) : null

  const helmet =
    windowType === 'sub' ? (
      isChildView ? (
        <Helmet title={`${title}`} />
      ) : (
        <Helmet title={`${getAppName()} - ${title}`} />
      )
    ) : null

  return (
    <RouteStyle platform={platform}>
      {helmet}
      <PlatformRoute>
        {subheader}
        {React.cloneElement(children as React.ReactElement, {
          header: Header ? <Header {...window} /> : null,
          footer: Footer ? <Footer /> : null,
        })}
      </PlatformRoute>
    </RouteStyle>
  )
}

export { RouteStyle, RouteWrapper }
