import React, { createRef } from 'react'
import Helmet from 'react-helmet'
import { styled, ThemeProvider } from 'rt-theme'
import FloatingTools from './components/FloatingsTools'
import OnePageNavBar from './components/OnePageNavBar'
import { Block, SectionBlock } from './styled'

import Atoms from './sections/Atoms'
import ColorSpectrum from './sections/ColorSpectrum'
import CoreBranding from './sections/CoreBranding'
import FontFamilies from './sections/FontFamilies'
import Introduction from './sections/Introduction'
import Iconography from './sections/Iconography'

const sections: Array<{ path: string; Section: React.ComponentType; title: string }> = [
  { path: 'color-spectrum', Section: ColorSpectrum, title: 'Colour' },
  { path: 'core-branding', Section: CoreBranding, title: 'Color branding' },
  { path: 'font-families', Section: FontFamilies, title: 'Typography' },
  { path: 'icons-family', Section: Iconography, title: 'Iconography' },
  { path: 'atoms-molecules', Section: Atoms, title: 'Atoms' },
]

const StyleguideRoute: React.FC = () => {
  const refs: React.RefObject<HTMLDivElement>[] = [...Array(sections.length)].map(() => createRef())
  const navSections = sections.map((section, index) => ({ ...section, ref: refs[index] }))

  return (
    <React.Fragment>
      <Helmet>
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
          <SectionBlock mh={5} colorScheme="inverted" />
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
