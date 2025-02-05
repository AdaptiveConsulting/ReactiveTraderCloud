import {
  ComponentType,
  RefObject,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react"
import { Link } from "react-router-dom"
import styled, { css } from "styled-components"

import Logo from "@/client/components/logos/AdaptiveLogo"
import { Typography } from "@/client/components/Typography"
import { useScrollToHashElement } from "@/client/utils"

import { Flex } from "../styled"
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

export const OnePageNavBar = (props: OnePageNavBarProps) => {
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
      !window.location.hash.includes(currentSectionScrolled.path)
    ) {
      window.history.pushState(null, "", "#" + currentSectionScrolled.path)
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

  useScrollToHashElement()

  return (
    <>
      <NavBarBleed className={isSticky ? "sticky" : ""} ref={ref}>
        <FlexWrapper justifyContent="space-between" alignItems="center">
          <LogoContainer onClick={() => scrollToSection(0)}>
            <Logo />
            <Typography variant="Display sm/Regular">
              Design Systems Library UI
            </Typography>
          </LogoContainer>
          <div>
            <FlexWrapper justifyContent="flex-start" alignItems="center">
              {sections.map(
                (section) =>
                  section && (
                    <OnePageNavLink
                      key={`navlink-${section.path}`}
                      to={`#${section.path}`}
                      className={isActive(section.path)}
                      onClick={() => setCurrentSection(section.title)}
                    >
                      <Typography
                        variant="Text xl/Regular"
                        color="Colors/Text/text-primary (900)"
                      >
                        {section.title}
                      </Typography>
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
            <Typography
              variant="Display md/Regular"
              textTransform="uppercase"
              color="Colors/Text/text-brand-primary (900)"
            >
              {currentSection}
            </Typography>
          </FlexWrapper>
        </TitleBar>
      )}
    </>
  )
}

const LogoContainer = styled.div`
  cursor: pointer;
`

const OnePageNavLink = styled(Link)`
  text-decoration: none;
  padding: 9px 0;
  margin-right: ${({ theme }) => theme.newTheme.spacing.xl};
  border-bottom: 3px solid transparent;

  &:hover,
  &.active {
    border-bottom: 3px solid white;
    ${({ theme }) =>
      css({
        borderBottom: `3px solid ${theme.newTheme.color["Colors/Foreground/fg-brand-primary (600)"]}`,
      })};
  }
`

const FlexWrapper = styled(Flex)`
  align-items: center;
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
      backgroundColor: theme.newTheme.color["Colors/Background/bg-primary_alt"],
      borderBottom: `2px solid ${theme.newTheme.color["Colors/Border/border-tertiary"]}`,
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

const TitleBar = styled(NavBarBleed)`
  display: none;
  height: 50px;

  &.sticky {
    display: none;
  }

  @media all and (min-width: 768px) {
    &.sticky {
      top: 76px;
      display: flex;
    }
  }
`
