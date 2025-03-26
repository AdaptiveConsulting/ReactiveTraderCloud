import { ReactNode, useState } from "react"

import { Line } from "@/client/components/Line"
import Logo from "@/client/components/logos/AdaptiveLogo"
import { WEBSITE } from "@/client/constants"
import { isMobileDevice } from "@/client/utils"

import {
  AppHeaderRoot,
  AppHeaderWrapper,
  Fill,
  HeaderNav,
  LogoWrapper,
} from "./Header.styles"
import InstrumentTypeSelector from "./InstrumentTypeSelector"
import LoginControls from "./LoginControls"
import { PWABanner, PWAInstallBanner, PWALaunchButton } from "./PWA"
import ThemeSwitcher from "./theme-switcher"

export interface HeaderProps {
  logo?: ReactNode
  filler?: ReactNode
  controls?: ReactNode
  switches?: ReactNode
}

export const defaultLogo = (
  <LogoWrapper>
    <Logo
      size={1.75}
      role="button"
      onClick={() => {
        window.gtag("event", "outbound_click", {
          destination: WEBSITE,
        })
        window.open(WEBSITE)
      }}
    />
  </LogoWrapper>
)

const symbolLogo = (
  <LogoWrapper>
    <Logo
      size={1.75}
      role="button"
      onClick={() => {
        window.gtag("event", "outbound_click", {
          destination: WEBSITE,
        })
        window.open(WEBSITE)
      }}
      withText={false}
    />
  </LogoWrapper>
)

export const defaultFiller = <Fill aria-hidden={true} />

const DefaultSwitches = () => {
  return (
    <>
      <InstrumentTypeSelector />
      <ThemeSwitcher />
    </>
  )
}

const defaultControls = <LoginControls />

const SESSION = "PWABanner"

const Header = ({ logo, filler, controls, switches }: HeaderProps) => {
  const [banner, setBanner] = useState<string>(
    sessionStorage.getItem(SESSION) || PWABanner.NotSet,
  )
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false)

  const updateBanner = (value: PWABanner) => {
    setBanner(value)
    sessionStorage.setItem(SESSION, value)
  }

  return (
    <AppHeaderWrapper role="banner" aria-label="Reactive Trader Header">
      <AppHeaderRoot>
        {logo || (isMobileDevice ? symbolLogo : defaultLogo)}
        <Line height="4xl" />
        {filler}
        <HeaderNav>
          {switches || <DefaultSwitches />}
          {controls || defaultControls}
          <PWALaunchButton state={banner} setIsModalOpen={setIsModalOpen} />
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

export default Header
