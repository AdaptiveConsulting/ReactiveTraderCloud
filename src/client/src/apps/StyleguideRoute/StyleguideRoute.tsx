import React from 'react'
import { styled, ThemeProvider } from 'rt-theme'
import FloatingTools from './components/FloatingsTools'
import OnePageNavBar from './components/OnePageNavBar'
import { Block, SectionBlock } from './styled'

import Atoms from './sections/Atoms'
import ColorSpectrum from './sections/ColorSpectrum'
import CoreBranding from './sections/CoreBranding'
import FontFamilies from './sections/FontFamilies'
import Introduction from './sections/Introduction'

const sections: Array<{ path: string; Section: React.ComponentType; title: string }> = [
  { path: 'color-spectrum', Section: ColorSpectrum, title: 'Colour' },
  { path: 'font-families', Section: FontFamilies, title: 'Typography' },
  { path: 'core-branding', Section: CoreBranding, title: 'Iconography' },
  { path: 'atoms-molecules', Section: Atoms, title: 'Atoms' },
]

const navSections: Array<{ path: string; title: string }> = sections.map(({ path, title }) => ({
  path,
  title,
}))

const StyleguideRoute: React.FC = () => (
  <ThemeProvider>
    <Root>
      <FloatingTools />
      <Introduction key="introduction" />
      <OnePageNavBar sections={navSections} />
      <React.Fragment>
        {sections.map(({ path, Section, title }) => (
          <div id={path} style={{ scrollMargin: '126px' }}>
            <Section key={path} />
          </div>
        ))}
      </React.Fragment>
      <SectionBlock mh={5} colorScheme="inverted" />
    </Root>
  </ThemeProvider>
)

export const Root = styled(Block)`
  min-height: 100%;
  max-width: 100vw;
  overflow: hidden;
`

export default StyleguideRoute
export { StyleguideRoute }
