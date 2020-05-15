import React, { ReactNode, useEffect, useState } from 'react'
import { styled } from 'rt-theme'
import { Platform, usePlatform, isParentAppOpenfinLauncher } from 'rt-platforms'
import { getAppName } from 'rt-util'

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

const RouteWrapper: React.FC<RouteWrapperProps> = props => {
  const { children, windowType = 'main', title } = props
  const [fromLauncher, setFromLauncher] = useState<boolean>(false)
  const platform = usePlatform()

  const { PlatformHeader, PlatformControls, PlatformRoute, window } = platform

  useEffect(() => {
    isParentAppOpenfinLauncher()
      .then(isLauncher => {
        setFromLauncher(isLauncher)
      })
      .catch(() => {
        console.error('Cannot find parent window')
      })
  }, [])

  const isBlotterOrTrade = title === 'trades' || title === 'live rates'

  const Header = windowType === 'main' ? PlatformControls : null
  const subheader =
    windowType === 'sub' ? (
      <PlatformHeader
        close={fromLauncher && window.close}
        popIn={!fromLauncher && window.close}
        minimize={window.minimize}
        title={`${getAppName()} - ${title}`}
        isBlotterOrTrade={isBlotterOrTrade}
      />
    ) : null

  return (
    <RouteStyle platform={platform}>
      <PlatformRoute>
        {subheader}
        {React.cloneElement(children as React.ReactElement, {
          header: Header ? <Header {...window} /> : null,
        })}
      </PlatformRoute>
    </RouteStyle>
  )
}

export { RouteStyle, RouteWrapper }
