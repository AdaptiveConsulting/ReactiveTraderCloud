import { ReactNode } from "react"

import Logo from "@/components/Logo"

import {
  AppHeaderRoot,
  AppHeaderWrapper,
  Fill,
  HeaderNav,
  LogoWrapper,
} from "./Header.styles"

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

export const AdminHeader = ({ logo, filler, controls }: Props) => {
  return (
    <AppHeaderWrapper role="banner" aria-label="Reactive Trader Header">
      <AppHeaderRoot>
        {logo || defaultLogo}
        {filler || defaultFiller}

        <HeaderNav>{controls}</HeaderNav>
      </AppHeaderRoot>
    </AppHeaderWrapper>
  )
}
