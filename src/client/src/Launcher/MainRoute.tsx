import { Loader } from "@/components/Loader"
import LogoIcon from "@/components/LogoIcon"
import Measure, { ContentRect } from "react-measure"
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
import { useCallback, useEffect, useRef, useState } from "react"
import { NlpSuggestions } from "./NlpSuggestions/NlpSuggestions"
import {
  onResetInput,
  useIsNlpIntentLoading,
  useNlpInput,
  useNlpIntent,
} from "./services/nlpService"
import { OverlayProvider } from "./overlayContext"
import {
  minimiseCurrentWindow,
  getCurrentWindowBounds,
  animateCurrentWindowSize,
  useAppBoundReset,
} from "./utils/openfin"
import { LaunchButton } from "./components/LaunchButton"
import { Bounds } from "openfin/_v2/shapes/shapes"
import { closeWindow } from "@/utils/window/closeWindow"

const expandedLauncherWidth = 600

const Logo: React.FC<{ active: boolean }> = ({ active }) => (
  <LogoLauncherContainer>
    {useIsNlpIntentLoading() ? (
      <Loader size={21} opacity={1} />
    ) : (
      <LogoIcon width={1.2} height={1.2} active={active} />
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
    <ExitButton onClick={closeWindow}>
      <ExitIcon />
    </ExitButton>
    <MinimiseButton onClick={minimiseCurrentWindow}>
      {minimiseNormalIcon}
    </MinimiseButton>
  </MinExitContainer>
)

export function MainRoute() {
  const [isSearchVisible, setIsSearchVisible] = useState(false)
  const [initialBounds, setInitialBounds] = useState<Bounds>()
  const [responseHeight, setResponseHeight] = useState<number>()
  const overlayRef = useRef<HTMLDivElement>(null)
  const [overlay, setOverlay] = useState<HTMLDivElement | null>(null)
  const intent = useNlpIntent()
  const searchValue = useNlpInput()

  useAppBoundReset(initialBounds)

  useEffect(() => {
    setOverlay(overlayRef.current)
    getCurrentWindowBounds().then(setInitialBounds).catch(console.error)
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
