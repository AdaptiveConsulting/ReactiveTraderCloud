import { FC, useState, ReactNode } from "react"
import LoginControls from "./LoginControls"
import Logo from "@/components/Logo"
import ThemeSwitcher from "./theme-switcher"
import {
  LogoWrapper,
  AppHeaderWrapper,
  AppHeaderRoot,
  HeaderNav,
  Fill,
} from "./Header.styles"
import { PWABanner, PWAInstallBanner, PWALaunchButton } from "./PWA"

interface Props {
  logo?: ReactNode
  filler?: ReactNode
  controls?: ReactNode
  switches?: ReactNode
}

const defaultLogo = (
  <LogoWrapper>
    <Logo
      size={1.75}
      role="button"
      onClick={() => {
        window.ga(
          "send",
          "event",
          "RT - Outbound",
          "click",
          "https://weareadaptive.com",
        )
        window.open("https://weareadaptive.com/")
      }}
      data-qa="header__root-logo"
    />
  </LogoWrapper>
)

const defaultFiller = <Fill aria-hidden={true} />

const defaultSwitches = <ThemeSwitcher />

const defaultControls = <LoginControls />

const SESSION = "PWABanner"

const Header: FC<Props> = ({ logo, filler, controls, switches }) => {
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
        {logo || defaultLogo}
        {filler || defaultFiller}

        <HeaderNav>
          {switches || defaultSwitches}
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
