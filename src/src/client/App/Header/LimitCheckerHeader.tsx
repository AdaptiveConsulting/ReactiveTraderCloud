import { defaultFiller, defaultLogo, HeaderProps } from "./Header"
import { AppHeaderRoot, AppHeaderWrapper, HeaderNav } from "./Header.styles"

export const LimitCheckerHeader = ({ logo, filler, controls }: HeaderProps) => {
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
