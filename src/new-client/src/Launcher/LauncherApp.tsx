import styled from "styled-components"
import { Loader } from "@/components/Loader"
import LogoIcon from "@/components/Logo"
import {
  RootLauncherContainer,
  LauncherContainer,
  LauncherGlobalStyle,
  LogoLauncherContainer,
  SearchButtonContainer,
  MinExitContainer,
  ExitButton,
  MinimiseButton,
  RootResultsContainer,
} from "./styles"
import { ExitIcon, SearchIcon, minimiseNormalIcon } from "./icons"
import { LauncherApps } from "./LauncherApps"
import { Search } from "./Search"
import { useEffect, useRef, useState } from "react"
import { NlpSuggestions } from "./NlpSuggestions/NlpSuggestions"
import { useIsNlpIntentLoading } from "./services/nlpService"
import { OverlayProvider } from "./overlayContext"

const Logo: React.FC = () => (
  <LogoLauncherContainer>
    {useIsNlpIntentLoading() ? (
      <Loader minWidth="20" />
    ) : (
      <LogoIcon width={1.2} height={1.2} />
    )}
  </LogoLauncherContainer>
)

const Response = styled.div`
  font-size: 1rem;
  background: ${({ theme }) => theme.core.darkBackground};
  padding: 0.75rem;
`

const StyledButton = styled.button<{
  iconFill?: string
  iconHoverFill?: string
  iconHoverBackground?: string
  active?: boolean
}>`
  width: 40px;
  height: ${({ active }) => (active ? "40px" : "45px")};
  font-size: 1.5rem;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-decoration: none;
  position: relative;

  border-radius: 4px;
  background-color: ${({ iconHoverBackground, active }) =>
    active ? iconHoverBackground : "inherited"};

  svg {
    fill: ${({ iconFill }) => iconFill};
  }

  &:hover {
    height: 45px;
    background-color: ${({ iconHoverBackground }) => iconHoverBackground};
    justify-content: ${({ title }) =>
      title === "Search ecosystem" ? "center" : "start"};
    padding-top: ${({ title }) =>
      title === "Search ecosystem"
        ? "0"
        : title === "Launch Excel"
        ? "2.5px"
        : "6px"};

    svg {
      fill: ${({ iconHoverFill }) => iconHoverFill};
    }
    span {
      color: ${({ theme }) => theme.core.textColor};
    }
  }
`

interface LaunchButtonProps {
  onClick: () => void
  iconFill?: string
  iconHoverFill?: string
  iconHoverBackground?: string
  children: JSX.Element[] | JSX.Element
  title?: string
  active?: boolean
}

export const LaunchButton = (props: LaunchButtonProps) => (
  <StyledButton
    title={props.title}
    onClick={props.onClick}
    iconFill={props.iconFill}
    iconHoverFill={props.iconHoverFill}
    iconHoverBackground={props.iconHoverBackground}
    active={props.active}
  >
    {props.children}
  </StyledButton>
)

const SearchButton: React.FC<{
  onClick: () => void
  isSearchVisible: boolean
}> = ({ onClick, isSearchVisible }) => (
  <SearchButtonContainer isSearchVisible={isSearchVisible}>
    <LaunchButton
      iconFill="#CFCFCF"
      iconHoverFill="#FFFFFF"
      title="Search ecosystem"
      onClick={onClick}
    >
      {SearchIcon}
    </LaunchButton>
  </SearchButtonContainer>
)

const LauncherMinimiseAndExit: React.FC = () => (
  <>
    <ExitButton onClick={() => {}}>
      <ExitIcon />
    </ExitButton>
    <MinimiseButton onClick={() => {}}>{minimiseNormalIcon}</MinimiseButton>
  </>
)

const OverlayContainer = styled.div`
  width: 100%;
  max-width: 100%;
  position: absolute;
  z-index: 9;
  top: 0;
`

export function LauncherApp() {
  const [isSearchVisible, setIsSearchVisible] = useState(false)

  const overlayRef = useRef<HTMLDivElement>(null)
  const [overlay, setOverlay] = useState<HTMLDivElement | null>(null)

  useEffect(() => {
    setOverlay(overlayRef.current)
  }, [])

  return (
    <OverlayProvider value={overlay}>
      <RootLauncherContainer>
        <LauncherContainer showResponsePanel={false}>
          <LauncherGlobalStyle />
          <Logo />
          <LauncherApps />
          <Search visible={isSearchVisible} />
          <SearchButton
            isSearchVisible={isSearchVisible}
            onClick={() => {
              setIsSearchVisible(true)
            }}
          />

          <MinExitContainer>
            <LauncherMinimiseAndExit />
          </MinExitContainer>
          <OverlayContainer ref={overlayRef} />
        </LauncherContainer>
        <RootResultsContainer>
          <Response>
            <NlpSuggestions />
          </Response>
        </RootResultsContainer>
      </RootLauncherContainer>
    </OverlayProvider>
  )
}
