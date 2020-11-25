import React, { useCallback, useState } from 'react'
import ReactGA from 'react-ga'
import styled from 'styled-components/macro'
import LoginControls from './LoginControls'
import Logo from './Logo'
import ThemeSwitcher from './theme-switcher'
import { PWABanner, PWALaunchButton, PWAInstallBanner } from './PWAInstallPrompt'
import { ToggleOpenFinLayoutLock } from 'rt-platforms/openfin/components'

const SESSION = 'PWABanner'

interface Props {
  filler?: React.ReactNode
  controls?: React.ReactNode
}

const Header: React.FC<Props> = ({ filler, controls }) => {
  const [banner, setBanner] = useState<string>(sessionStorage.getItem(SESSION) || PWABanner.NotSet)
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false)

  const updateBanner = useCallback(
    (value: PWABanner) => {
      setBanner(value)
      sessionStorage.setItem(SESSION, value)
    },
    [setBanner]
  )

  const onLogoClick = useCallback(() => {
    ReactGA.event({
      category: 'RT - Outbound',
      action: 'click',
      label: 'https://weareadaptive.com',
      transport: 'beacon',
    })
    window.open('https://weareadaptive.com/')
  }, [])

  return (
    <AppHeaderWrapper>
      <AppHeaderRoot>
        <LogoWrapper>
          <Logo size={1.75} onClick={onLogoClick} data-qa="header__root-logo" />
        </LogoWrapper>
        {filler === undefined ? <Fill /> : filler}
        <HeaderNav>
          <ToggleOpenFinLayoutLock />
          <ThemeSwitcher />
          <LoginControls />
          <PWALaunchButton state={banner} setIsModalOpen={setIsModalOpen} />
          {controls}
        </HeaderNav>
      </AppHeaderRoot>
      <PWAInstallBanner
        banner={banner}
        updateBanner={updateBanner}
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
      />
    </AppHeaderWrapper>
  )
}

const LogoWrapper = styled.div`
  &:hover {
    cursor: pointer;
  }
`

const AppHeaderWrapper = styled.div`
  position: relative;
`

const AppHeaderRoot = styled.div`
  width: calc(100% - 2rem);
  max-width: 100%;

  height: 3.5rem;

  margin: 0.25rem 1rem;

  display: flex;
  justify-content: space-between;
  align-items: center;

  background-color: ${({ theme }) => theme.core.darkBackground};
  border-bottom: 1px solid ${({ theme }) => theme.core.dividerColor};
  color: ${({ theme }) => theme.core.textColor};

  position: relative;
  z-index: 5;

  box-shadow: 0 0.125rem 0 ${({ theme }) => theme.core.darkBackground};
`

const HeaderNav = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  height: 2rem;
`

const Fill = styled.div`
  flex: 1;
  height: calc(3.5rem - 5px);
  margin-top: 5px;
  display: flex;
  justify-content: center;
  align-items: center;
  text-transform: uppercase;
  font-weight: normal;
  opacity: 0.58;
  font-size: 0.625rem;
  /**
    TODO 8/22 extract this extension of header, and the fill outside header layout
  */
  -webkit-app-region: drag;
  cursor: -webkit-grab;
`

export default Header
