import OpenFin from "@openfin/core"
import { useCallback, useEffect, useRef, useState } from "react"
import Measure, { ContentRect } from "react-measure"

import { Loader } from "@/client/components/Loader"
import LogoIcon from "@/client/components/LogoIcon"
import {
  registerCreditQuoteNotifications,
  unregisterCreditQuoteNotifications,
} from "@/client/notifications"

import { LaunchButton } from "./components/LaunchButton"
import { ExitIcon, minimiseNormalIcon, SearchIcon } from "./icons"
import { LauncherApps } from "./LauncherApps"
import { NlpSuggestions } from "./NlpSuggestions/NlpSuggestions"
import { OverlayProvider } from "./overlayContext"
import { Search } from "./Search"
import {
  onResetInput,
  useIsNlpIntentLoading,
  useNlpInput,
  useNlpIntent,
} from "./services/nlpService"
import {
  ExitButton,
  LauncherContainer,
  LauncherGlobalStyle,
  LogoLauncherContainer,
  MinExitContainer,
  MinimiseButton,
  OverlayContainer,
  Response,
  RootLauncherContainer,
  RootResultsContainer,
  SearchButtonContainer,
} from "./styles"
import {
  animateCurrentWindowSize,
  closePlatform,
  getCurrentWindowBounds,
  minimiseCurrentWindow,
  useAppBoundReset,
} from "./utils/openfin"

const expandedLauncherWidth = 600

const Logo = ({ active }: { active: boolean }) => (
  <LogoLauncherContainer>
    {useIsNlpIntentLoading() ? (
      <Loader size={21} opacity={1} />
    ) : (
      <LogoIcon width={1.2} height={1.2} active={active} />
    )}
  </LogoLauncherContainer>
)

const SearchButton = ({
  onClick,
  isSearchVisible,
}: {
  onClick: () => void
  isSearchVisible: boolean
}) => (
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

const LauncherMinimiseAndExit = () => (
  <MinExitContainer>
    <ExitButton onClick={closePlatform}>
      <ExitIcon />
    </ExitButton>
    <MinimiseButton onClick={minimiseCurrentWindow}>
      {minimiseNormalIcon}
    </MinimiseButton>
  </MinExitContainer>
)

function Launcher() {
  const [isSearchVisible, setIsSearchVisible] = useState(false)
  const [initialBounds, setInitialBounds] = useState<OpenFin.Bounds>()
  const [responseHeight, setResponseHeight] = useState<number>()
  const overlayRef = useRef<HTMLDivElement>(null)
  const [overlay, setOverlay] = useState<HTMLDivElement | null>(null)
  const intent = useNlpIntent()
  const searchValue = useNlpInput()

  useAppBoundReset(initialBounds)

  useEffect(() => {
    setOverlay(overlayRef.current)
    getCurrentWindowBounds().then(setInitialBounds).catch(console.error)
    registerCreditQuoteNotifications()

    return () => {
      unregisterCreditQuoteNotifications()
    }
  }, [])

  useEffect(() => {
    if (initialBounds) {
      if (isSearchVisible) {
        animateCurrentWindowSize({
          ...initialBounds,
          width: expandedLauncherWidth,
          height: responseHeight
            ? responseHeight + initialBounds.height
            : initialBounds.height,
        })
      } else {
        animateCurrentWindowSize(initialBounds)
      }
    }
  }, [isSearchVisible, initialBounds, responseHeight])

  const onHideSearch = () => {
    setIsSearchVisible(false)
    onResetInput()
  }

  const handleSearchSizeChange = useCallback(
    (contentRect: ContentRect) => {
      if (contentRect.bounds && contentRect.bounds.height !== responseHeight) {
        setResponseHeight(contentRect.bounds.height)
      }
    },
    [responseHeight],
  )

  return (
    <OverlayProvider value={overlay}>
      <RootLauncherContainer>
        <LauncherContainer showResponsePanel={false}>
          <LauncherGlobalStyle />
          <Logo active={isSearchVisible} />
          <LauncherApps />
          <Search
            value={searchValue}
            visible={isSearchVisible}
            onHide={onHideSearch}
          />
          <SearchButton
            isSearchVisible={isSearchVisible}
            onClick={() => {
              if (isSearchVisible) {
                onResetInput()
              }
              setIsSearchVisible(!isSearchVisible)
            }}
          />
          <LauncherMinimiseAndExit />
          <OverlayContainer ref={overlayRef} />
        </LauncherContainer>
        <Measure bounds onResize={handleSearchSizeChange}>
          {({ measureRef }) => (
            <div ref={measureRef}>
              {intent !== "loading" && searchValue && (
                <RootResultsContainer>
                  <Response>
                    <NlpSuggestions intent={intent} />
                  </Response>
                </RootResultsContainer>
              )}
            </div>
          )}
        </Measure>
      </RootLauncherContainer>
    </OverlayProvider>
  )
}

export default Launcher
