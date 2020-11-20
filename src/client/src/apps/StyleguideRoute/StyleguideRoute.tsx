import React, { createRef } from 'react'
import Helmet from 'react-helmet'
import styled from 'styled-components/macro'
import { ThemeProvider } from 'rt-theme'
import FloatingTools from './components/FloatingsTools'
import OnePageNavBar from './components/OnePageNavBar'
import { Block } from './styled'

import Atoms from './sections/Atoms'
import CoreBranding from './sections/CoreBranding'
import FontFamilies from './sections/FontFamilies'
import Introduction from './sections/Introduction'
import Iconography from './sections/Iconography'
import Molecules from './sections/Molecules'
import { getAppName } from 'rt-util'

const sections: Array<{ path: string; Section: React.ComponentType; title: string }> = [
  { path: 'core-branding', Section: CoreBranding, title: 'Colour' },
  { path: 'font-families', Section: FontFamilies, title: 'Typography' },
  { path: 'icons-family', Section: Iconography, title: 'Iconography' },
  { path: 'atoms-components', Section: Atoms, title: 'Atoms' },
  { path: 'molecules-components', Section: Molecules, title: 'Molecules' },
]

const StyleguideRoute: React.FC = () => {
  const refs: React.RefObject<HTMLDivElement>[] = [...Array(sections.length)].map(() => createRef())
  const navSections = sections.map((section, index) => ({ ...section, ref: refs[index] }))

  return (
    <React.Fragment>
      <Helmet title={getAppName('Style Guide for Reactive Trader®')}>
        <link
          rel="stylesheet"
          type="text/css"
          href="https://use.fontawesome.com/releases/v5.2.0/css/all.css"
        />
      </Helmet>
      <ThemeProvider>
        <Root>
          <FloatingTools />
          <Introduction key="introduction" />
          <OnePageNavBar sections={navSections} />
          <React.Fragment>
            {navSections.map(({ path, Section, ref }) => (
              <ScrollableContainer id={path} key={path} ref={ref}>
                <Section />
              </ScrollableContainer>
            ))}
          </React.Fragment>
        </Root>
      </ThemeProvider>
    </React.Fragment>
  )
}

const ScrollableContainer = styled.div`
  scroll-margin: 76px;

  @media (min-width: 768px) {
    scroll-margin: 126px;
  }
`

export const Root = styled(Block)`
  min-height: 100%;
  max-width: 100vw;
  overflow: hidden;
`

export default StyleguideRoute
export { StyleguideRoute }
