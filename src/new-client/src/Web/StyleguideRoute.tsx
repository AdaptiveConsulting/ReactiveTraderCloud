import styled from "styled-components"
import { Introduction } from "@/styleguide/Introduction/Introduction"

import React, { createRef } from "react"
import Helmet from "react-helmet"
import { ThemeProvider } from "@/theme"
import FloatingTools from "@/styleguide/components/FloatingsTools"
import OnePageNavBar from "@/styleguide/components/OnePageNavBar"
import { Block } from "@/styleguide/styled/Block"

import Atoms from "@/styleguide/sections/Atoms"
import CoreBranding from "@/styleguide/sections/CoreBranding"
import FontFamilies from "@/styleguide/sections/FontFamilies"
import Iconography from "@/styleguide/sections/Iconography"
import Molecules from "@/styleguide/sections/Molecules"
// import { getAppName } from '@/utils'

const sections: Array<{
  path: string
  Section: React.ComponentType
  title: string
}> = [
  { path: "core-branding", Section: CoreBranding, title: "Colour" },
  { path: "font-families", Section: FontFamilies, title: "Typography" },
  { path: "icons-family", Section: Iconography, title: "Iconography" },
  { path: "atoms-components", Section: Atoms, title: "Atoms" },
  { path: "molecules-components", Section: Molecules, title: "Molecules" },
]

const StyleguideRoute: React.FC = () => {
  const refs: React.RefObject<HTMLDivElement>[] = [
    ...Array(sections.length),
  ].map(() => createRef())
  const navSections = sections.map((section, index) => ({
    ...section,
    ref: refs[index],
  }))

  return (
    <>
      <Helmet title={"Style Guide for Reactive Trader®"}>
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
          <>
            {navSections.map(({ path, Section, ref }) => (
              <ScrollableContainer id={path} key={path} ref={ref}>
                <Section />
              </ScrollableContainer>
            ))}
          </>
        </Root>
      </ThemeProvider>
    </>
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
