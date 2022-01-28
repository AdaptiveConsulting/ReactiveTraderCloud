import { createRef, FC } from "react"
import Helmet from "react-helmet"
import styled from "styled-components"
import FloatingTools from "./components/FloatingsTools"
import OnePageNavBar from "./components/OnePageNavBar"
import Introduction from "./sections/Introduction"
import { Block } from "./styled"

import CoreBranding from "./sections/CoreBranding"
import FontFamilies from "./sections/FontFamilies"
import Iconography from "./sections/Iconography"
import Atoms from "./sections/Atoms"
import Molecules from "./sections/Molecules"

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

const Styleguide: FC = () => {
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
    </>
  )
}

const ScrollableContainer = styled.div`
  scroll-margin: 76px;

  @media (min-width: 768px) {
    scroll-margin: 126px;
  }
`

const Root = styled(Block)`
  min-height: 100%;
  max-width: 100vw;
  overflow: hidden;
`

export default Styleguide
