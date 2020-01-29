import React, { useEffect, ReactNode } from 'react'
import { styled } from 'rt-theme'
import { Platform, usePlatform } from 'rt-platforms'

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

//@ts-ignore
const isChildView = window.fin && window.fin.me.isView

const RouteWrapper: React.FC<RouteWrapperProps> = ({ children, windowType = 'main' , title}) => {
  const platform = usePlatform()
  const { PlatformFooter, PlatformHeader, PlatformControls, PlatformRoute, window } = platform

  const Header = windowType === 'main' ? PlatformControls : null
  const Footer = windowType === 'main' ? PlatformFooter : null
  const subheader = windowType === 'sub' && !isChildView ? <PlatformHeader close={window.close} /> : null

  useEffect(() => {
    if (title)
      document.title = title;
  }, [])

  return (
    <RouteStyle platform={platform}>
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
