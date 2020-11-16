import React, { ReactNode, useEffect } from 'react'
import styled from 'styled-components/macro'
import { Platform, usePlatform } from 'rt-platforms'
import { useTheme, ThemeName } from 'rt-theme'

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
  const theme = useTheme()

  const { PlatformFooter, PlatformControls, PlatformRoute, window } = platform

  useEffect(() => {
    const head = document.getElementById('themeColor')
    head &&
      head.setAttribute(
        'content',
        theme.themeName === ThemeName.Dark ? 'rgb(40, 46, 57)' : 'rgb(249, 249, 249)'
      )
  }, [theme])

  const Header = windowType === 'main' ? PlatformControls : null
  const Footer = windowType === 'main' ? PlatformFooter : null

  return (
    <RouteStyle platform={platform}>
      <PlatformRoute title={title}>
        {React.cloneElement(children as React.ReactElement, {
          header: Header ? <Header {...window} /> : null,
          footer: Footer ? <Footer /> : null,
        })}
      </PlatformRoute>
    </RouteStyle>
  )
}

export { RouteStyle, RouteWrapper }
