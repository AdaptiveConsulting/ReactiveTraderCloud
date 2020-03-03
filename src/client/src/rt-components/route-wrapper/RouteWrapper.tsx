import React, { ReactNode } from 'react'
import { useParams } from 'react-router'
import { styled } from 'rt-theme'
import { Platform, usePlatform } from 'rt-platforms'
import { currencyFormatter } from 'rt-util'

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

interface RouteWrapperProps {
  children: ReactNode
  windowType?: WindowRole
  title?: string
}

const RouteWrapper: React.FC<RouteWrapperProps> = props => {
  const { children, windowType = 'main', title } = props
  const platform = usePlatform()
  const { symbol } = useParams()

  const { PlatformHeader, PlatformControls, PlatformRoute, window } = platform

  let formattedCurrency

  if (!title && symbol) {
    formattedCurrency = currencyFormatter(symbol)
  }

  const Header = windowType === 'main' ? PlatformControls : null
  const subheader =
    windowType === 'sub' ? (
      <PlatformHeader
        popIn={window.close}
        minimize={window.minimize}
        title={title || formattedCurrency}
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
