import { createRef, useEffect } from "react"
import styled, { createGlobalStyle } from "styled-components"

import FloatingTools from "./components/FloatingsTools"
import OnePageNavBar from "./components/OnePageNavBar"
import Atoms from "./sections/Atoms"
import CoreBranding from "./sections/CoreBranding"
import FontFamilies from "./sections/FontFamilies"
import Iconography from "./sections/Iconography"
import Introduction from "./sections/Introduction"
import Molecules from "./sections/Molecules"
import { Block } from "./styled"

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

const Styleguide = () => {
  useEffect(() => {
    document.title = "Style Guide for Reactive Trader®"
    const link = document.createElement("link")
    link.type = "text/css"
    link.rel = "stylesheet"
    link.href = "https://use.fontawesome.com/releases/v5.2.0/css/all.css"
    document.head.appendChild(link)

    return () => {
      document.head.removeChild(link)
    }
  }, [])

  const refs: React.RefObject<HTMLDivElement>[] = [
    ...Array(sections.length),
  ].map(() => createRef())
  const navSections = sections.map((section, index) => ({
    ...section,
    ref: refs[index],
  }))

  return (
    <>
      <StyleGuideGlobal />
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

const StyleGuideGlobal = createGlobalStyle`
  body, #root {
    overflow: initial;
  }
`

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
