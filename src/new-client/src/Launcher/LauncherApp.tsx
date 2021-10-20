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
  Response,
  OverlayContainer,
} from "./styles"
import { ExitIcon, SearchIcon, minimiseNormalIcon } from "./icons"
import { LauncherApps } from "./LauncherApps"
import { Search } from "./Search"
import { useEffect, useRef, useState } from "react"
import { NlpSuggestions } from "./NlpSuggestions/NlpSuggestions"
import { useIsNlpIntentLoading } from "./services/nlpService"
import { OverlayProvider } from "./overlayContext"
import {
  closeCurrentWindow,
  minimiseCurrentWindow,
} from "./utils/openfin-utils"
import { LaunchButton } from "./components/LaunchButton"

const Logo: React.FC = () => (
  <LogoLauncherContainer>
    {useIsNlpIntentLoading() ? (
      <Loader minWidth="20" />
    ) : (
      <LogoIcon width={1.2} height={1.2} />
    )}
  </LogoLauncherContainer>
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
  <MinExitContainer>
    <ExitButton onClick={closeCurrentWindow}>
      <ExitIcon />
    </ExitButton>
    <MinimiseButton onClick={minimiseCurrentWindow}>
      {minimiseNormalIcon}
    </MinimiseButton>
  </MinExitContainer>
)

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
          <LauncherMinimiseAndExit />
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
