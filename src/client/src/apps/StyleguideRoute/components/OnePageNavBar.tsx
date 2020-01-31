import React, { useRef, useEffect, useState } from 'react'
import { HashLink as Link } from 'react-router-hash-link'
import { css } from 'styled-components'
import { styled } from 'rt-theme'
import { Flex } from 'rt-components'
import { H2 } from '../elements'
import Logo from '../../MainRoute/components/app-header/Logo'
import { mapMarginPaddingProps } from '../styled/mapMarginPaddingProps'

export interface OnePageNavBar {
  sections: Array<{ path: string; title: string }>
}

const MAX_SCROLL_HEIGHT = 100000000
const isActive = (to: string): string => (window.location.hash === `#${to}` ? 'active' : '')

const OnePageNavBar: React.FC<OnePageNavBar> = props => {
  const ref = useRef<HTMLDivElement>(null)
  const { sections } = props
  const [scrollTop, setScrollTop] = useState(window.scrollY)
  const [positionNavBar, setPositionNavBar] = useState(MAX_SCROLL_HEIGHT)
  const [currentSection, setCurrentSection] = useState('')
  const [isSticky, setIsSticky] = useState(false)
  const handleScroll = () => setScrollTop(window.scrollY)
  const scrollToSection = (top: number) => {
    window.scrollTo({ top: top, behavior: 'smooth' })
  }

  useEffect(() => {
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    if (ref.current && positionNavBar === MAX_SCROLL_HEIGHT) {
      setPositionNavBar(ref.current.offsetTop)
    }
  }, [positionNavBar, scrollTop])

  useEffect(() => {
    setIsSticky(scrollTop > positionNavBar)
  }, [scrollTop, positionNavBar])

  useEffect(() => {
    if (!isSticky) {
      setCurrentSection('')
    }
  }, [isSticky, setCurrentSection])

  return (
    <React.Fragment>
      <NavBarBleed className={isSticky ? 'sticky' : ''} ref={ref}>
        <FlexWrapper justifyContent="space-between" alignItems="center">
          <LogoContainer onClick={() => scrollToSection(0)}>
            <Logo />
            <TextHeader>Design Systems Library UI</TextHeader>
          </LogoContainer>
          <div>
            <FlexWrapper justifyContent="flex-start" alignItems="center">
              {sections.map(({ path, title }) => (
                <OnePageNavLink
                  key={`navlink-${path}`}
                  to={`#${path}`}
                  scroll={el => el.scrollIntoView({ behavior: 'smooth', block: 'start' })}
                  className={isActive(path)}
                  onClick={() => setCurrentSection(title)}
                >
                  {title}
                </OnePageNavLink>
              ))}
            </FlexWrapper>
          </div>
        </FlexWrapper>
      </NavBarBleed>
      {currentSection && (
        <TitleBar className={isSticky ? 'sticky' : ''}>
          <FlexWrapper justifyContent="space-between" alignItems="center">
            <TitleHeading>{currentSection}</TitleHeading>
          </FlexWrapper>
        </TitleBar>
      )}
    </React.Fragment>
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
        borderBottom: `3px solid ${theme.secondary[4]}`,
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
      transition: 'background-color ease-out 0.15s',
      backgroundColor: theme.primary.base,
      borderBottom: `2px solid ${theme.primary[1]}`,
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
  margin: 0.5rem 0;
  ${({ theme }) =>
    css({
      color: theme.secondary[4],
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
