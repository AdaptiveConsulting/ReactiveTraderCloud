import {
  FC,
  RefObject,
  ComponentType,
  useRef,
  useEffect,
  useState,
  useCallback,
} from "react"
import { HashLink as Link } from "react-router-hash-link"
import styled, { css } from "styled-components"
import { Flex } from "../styled"
import { H2 } from "../elements"
import Logo from "@/components/Logo"
import { mapMarginPaddingProps } from "../styled/mapMarginPaddingProps"

export type NavSection =
  | {
      path: string
      title: string
      Section: ComponentType
      ref: RefObject<HTMLDivElement>
    }
  | undefined

export interface OnePageNavBarProps {
  sections: Array<NavSection>
}

const MAX_SCROLL_HEIGHT = 100000000
const DEFAULT_OFFSET = 130
const isActive = (to: string): string =>
  window.location.hash === `#${to}` ? "active" : ""

const OnePageNavBar: FC<OnePageNavBarProps> = (props) => {
  const ref = useRef<HTMLDivElement>(null)
  const { sections } = props
  const [scrollTop, setScrollTop] = useState(window.scrollY)
  const [positionNavBar, setPositionNavBar] = useState(MAX_SCROLL_HEIGHT)
  const [currentSection, setCurrentSection] = useState("")
  const [isSticky, setIsSticky] = useState(false)

  const getCurrentSection = useCallback((): NavSection => {
    let currentSection = undefined
    const currentScroll = window.scrollY

    sections.forEach((section: NavSection) => {
      if (section) {
        if (section.ref) {
          if (section.ref.current) {
            const borderTop = section.ref.current.offsetTop - DEFAULT_OFFSET
            const borderBottom =
              section.ref.current.offsetTop +
              section.ref.current.offsetHeight -
              DEFAULT_OFFSET

            if (currentScroll >= borderTop && currentScroll < borderBottom) {
              currentSection = section
            }
          }
        }
      }
    })

    return currentSection
  }, [sections])

  const handleScroll = useCallback(() => {
    setScrollTop(window.scrollY)
    const currentSectionScrolled: NavSection = getCurrentSection()

    if (
      typeof currentSectionScrolled !== "undefined" &&
      !location.hash.includes(currentSectionScrolled.path)
    ) {
      history.pushState(null, "", "#" + currentSectionScrolled.path)
      setCurrentSection(currentSectionScrolled.title)
    }
  }, [getCurrentSection])

  const scrollToSection = (top: number) => {
    window.scrollTo({ top: top, behavior: "smooth" })
  }

  useEffect(() => {
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [handleScroll])

  useEffect(() => {
    if (ref.current && positionNavBar === MAX_SCROLL_HEIGHT) {
      setPositionNavBar(ref.current.offsetTop)
    }
  }, [positionNavBar, scrollTop])

  useEffect(() => {
    setIsSticky(scrollTop > positionNavBar)
  }, [scrollTop, positionNavBar])

  return (
    <>
      <NavBarBleed className={isSticky ? "sticky" : ""} ref={ref}>
        <FlexWrapper justifyContent="space-between" alignItems="center">
          <LogoContainer onClick={() => scrollToSection(0)}>
            <Logo />
            <TextHeader>Design Systems Library UI</TextHeader>
          </LogoContainer>
          <div>
            <FlexWrapper justifyContent="flex-start" alignItems="center">
              {sections.map(
                (section) =>
                  section && (
                    <OnePageNavLink
                      key={`navlink-${section.path}`}
                      to={`#${section.path}`}
                      scroll={(el) =>
                        el.scrollIntoView({
                          behavior: "smooth",
                          block: "start",
                        })
                      }
                      className={isActive(section.path)}
                      onClick={() => setCurrentSection(section.title)}
                    >
                      {section.title}
                    </OnePageNavLink>
                  ),
              )}
            </FlexWrapper>
          </div>
        </FlexWrapper>
      </NavBarBleed>
      {currentSection && (
        <TitleBar className={isSticky ? "sticky" : ""}>
          <FlexWrapper justifyContent="space-between" alignItems="center">
            <TitleHeading>{currentSection}</TitleHeading>
          </FlexWrapper>
        </TitleBar>
      )}
    </>
  )
}

const TextHeader = styled.p`
  ${({ theme }) =>
    css({
      color: theme.secondary.base,
    })};
  margin: 0;
`

const LogoContainer = styled.div`
  cursor: pointer;
`

const OnePageNavLink = styled(Link)`
  ${({ theme }) =>
    css({
      color: theme.secondary.base,
    })};
  text-decoration: none;
  padding: 9px 0;
  margin-right: 16px;
  border-bottom: 3px solid transparent;

  &:hover,
  &.active {
    border-bottom: 3px solid white;
    ${({ theme }) =>
      css({
        borderBottom: `3px solid ${theme.accents.primary.base}`,
      })};
  }
`

const FlexWrapper = styled(Flex)`
  flex-flow: row wrap;
  width: 100%;
  margin: 0 auto;
  max-width: 60rem;
`

const NavBar = styled.div`
  height: 76px;
  transition: all 1000ms ease;
`

const NavBarBleed = styled(NavBar)`
  ${({ theme }) =>
    css({
      transition: "background-color ease-out 0.15s",
      backgroundColor: theme.core.secondaryStyleGuideBackground,
      borderBottom: `2px solid ${theme.core.primaryStyleGuideBackground}`,
    })};

  display: flex;
  flex-flow: column nowrap;
  justify-content: center;
  padding-left: 1rem;
  padding-right: 1rem;
  position: relative;
  z-index: 10000;
  width: 100%;

  &.sticky {
    position: fixed;
    top: 0;
  }

  & > div > div:first-child {
    opacity: 0;
    display: none;
  }

  @media all and (min-width: 375px) {
    padding-left: 1.5rem;
    padding-right: 1.5rem;
  }

  @media all and (min-width: 420px) {
    padding-left: 2rem;
    padding-right: 2rem;
  }

  @media all and (min-width: 768px) {
    padding-left: 1.5rem;
    padding-right: 1.5rem;

    &.sticky {
      & > div > div:first-child {
        opacity: 1;
        display: block;
      }
    }
  }

  @media all and (min-width: 0) {
    ${mapMarginPaddingProps};
  }
`

const TitleHeading = styled(H2)`
  text-transform: uppercase;
  font-weight: normal;
  margin: 0.5rem 0;
  ${({ theme }) =>
    css({
      color: theme.accents.primary.base,
    })};
`

const TitleBar = styled(NavBarBleed)`
  display: none;
  height: 50px;

  &.sticky {
    display: none;
  }

  @media all and (min-width: 768px) {
    &.sticky {
      top: 76px;
      display: block;
    }
  }
`

export default OnePageNavBar
