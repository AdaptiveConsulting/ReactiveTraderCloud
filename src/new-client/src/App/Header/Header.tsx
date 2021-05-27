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

interface Props {
  logo?: React.ReactNode
  filler?: React.ReactNode
  controls?: React.ReactNode
  switches?: React.ReactNode
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

const Header: React.FC<Props> = ({ logo, filler, controls, switches }) => (
  <AppHeaderWrapper role="banner" aria-label="Reactive Trader Header">
    <AppHeaderRoot>
      {logo || defaultLogo}
      {filler || defaultFiller}

      <HeaderNav>
        {switches || defaultSwitches}
        {controls || defaultControls}
      </HeaderNav>
    </AppHeaderRoot>
  </AppHeaderWrapper>
)

export default Header
