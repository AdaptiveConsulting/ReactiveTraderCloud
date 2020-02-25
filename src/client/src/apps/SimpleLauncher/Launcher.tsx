import React, { useCallback, useEffect, useRef, useState, useMemo } from 'react'
import { LaunchButton } from './LaunchButton'
import { LauncherApps } from './LauncherApps'
import { AdaptiveLoader, LogoIcon } from 'rt-components'
import { usePlatform } from 'rt-platforms'
import { Bounds } from 'openfin/_v2/shapes'
import SearchIcon from './icons/searchIcon'
import { useNlpService } from './spotlight/components/useNlpService'
import {
  HorizontalContainer,
  LauncherGlobalStyle,
  MinExitContainer,
  ExitButton,
  MinimiseButton,
  LogoLauncherContainer,
  RootLauncherContainer,
  LauncherContainer,
  SearchButtonContainer,
  RootResultsContainer,
} from './styles'
import {
  animateCurrentWindowSize,
  closeCurrentWindow,
  getCurrentWindowBounds,
  minimiseCurrentWindow,
} from './windowUtils'
import { Response, getInlineSuggestionsComponent } from './spotlight'
import Measure, { ContentRect } from 'react-measure'
import { SearchControl } from './spotlight'
import { exitNormalIcon, minimiseNormalIcon } from './icons'

const exitIcon = exitNormalIcon()
const initialLauncherWidth = 355

const LauncherMinimiseAndExit: React.FC = () => (
  <>
    <ExitButton onClick={closeCurrentWindow}>{exitIcon}</ExitButton>
    <MinimiseButton onClick={minimiseCurrentWindow}>{minimiseNormalIcon}</MinimiseButton>
  </>
)

const SearchButton: React.FC<{
  onClick: () => void
  isSearchVisible: boolean
}> = ({ onClick, isSearchVisible }) => (
  <SearchButtonContainer isSearchVisible={isSearchVisible}>
    <LaunchButton title="Search ecosystem" onClick={onClick}>
      {SearchIcon}
    </LaunchButton>
  </SearchButtonContainer>
)

const DynamicLogo: React.FC<{ isMoving: boolean }> = ({ isMoving }) => (
  <LogoLauncherContainer>
    {isMoving ? (
      <AdaptiveLoader size={21} speed={isMoving ? 0.8 : 0} seperation={1} type="secondary" />
    ) : (
      <LogoIcon width={1.2} height={1.2} />
    )}
  </LogoLauncherContainer>
)

export const Launcher: React.FC = () => {
  const [initialBounds, setInitialBounds] = useState<Bounds>()
  const [contentBounds, setContentBounds] = useState<ContentRect>()
  const [isSearchVisible, setIsSearchVisible] = useState<boolean>(false)
  const [isSearchBusy, setIsSearchBusy] = useState<boolean>(false)
  const searchInputRef = useRef<HTMLInputElement>(null)
  const platform = usePlatform()
  const [contacting, response, sendRequest] = useNlpService()

  useEffect(() => {
    getCurrentWindowBounds()
      .then(setInitialBounds)
      .catch(console.error)
  }, [])

  const showSearch = useCallback(() => {
    setIsSearchVisible(!isSearchVisible)
  }, [isSearchVisible])

  // if search is made visible - focus on it
  useEffect(() => {
    if (isSearchVisible) {
      searchInputRef.current && searchInputRef.current.focus({ preventScroll: true })
    }
  }, [isSearchVisible])

  // hide search if Escape is pressed
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsSearchVisible(false)
      }
    }
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [])

  const handleSearchStateChange = useCallback((isTyping: boolean) => setIsSearchBusy(isTyping), [])

  const handleSearchSizeChange = useCallback(
    (contentRect: ContentRect) => {
      if (!initialBounds) {
        return
      }

      setContentBounds(contentRect)
      animateCurrentWindowSize({
        ...initialBounds,
        height: initialBounds.height + (contentRect.bounds ? contentRect.bounds.height : 0),
      })
    },
    [initialBounds],
  )

  const launcherContainerWidth = useMemo(
    () =>
      typeof response !== 'undefined' &&
      typeof contentBounds !== 'undefined' &&
      typeof contentBounds.bounds !== 'undefined'
        ? contentBounds.bounds.width
        : initialLauncherWidth,
    [contentBounds, response],
  )

  const showResponsePanel = useMemo(() => Boolean(isSearchVisible && response), [
    response,
    isSearchVisible,
  ])

  return (
    <RootLauncherContainer showResponsePanel={showResponsePanel}>
      <LauncherContainer width={launcherContainerWidth} showResponsePanel={showResponsePanel}>
        <LauncherGlobalStyle />
        <HorizontalContainer>
          <DynamicLogo isMoving={isSearchBusy || contacting} />
          <LauncherApps />
          <SearchControl
            ref={searchInputRef}
            onStateChange={handleSearchStateChange}
            response={response}
            sendRequest={sendRequest}
            platform={platform}
            isSearchVisible={isSearchVisible}
            launcherWidth={launcherContainerWidth}
          />
          <SearchButton onClick={showSearch} isSearchVisible={isSearchVisible} />
          <MinExitContainer>
            <LauncherMinimiseAndExit />
          </MinExitContainer>
        </HorizontalContainer>
      </LauncherContainer>
      <Measure bounds onResize={handleSearchSizeChange}>
        {({ measureRef }) => (
          <div ref={measureRef}>
            {isSearchVisible && response && (
              <RootResultsContainer>
                <Response>{getInlineSuggestionsComponent(response, platform)}</Response>
              </RootResultsContainer>
            )}
          </div>
        )}
      </Measure>
    </RootLauncherContainer>
  )
}
