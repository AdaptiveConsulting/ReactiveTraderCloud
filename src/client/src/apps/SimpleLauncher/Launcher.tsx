import React, { useCallback, useEffect, useRef, useState, useMemo } from 'react'
import { LaunchButton } from './LaunchButton'
import { LauncherApps } from './LauncherApps'
import { AdaptiveLoader, LogoIcon } from 'rt-components'
import { usePlatform } from 'rt-platforms'
import { Bounds } from 'openfin/_v2/shapes'
import SearchIcon from './icons/searchIcon'
import { useNlpService } from './spotlight/components/useNlpService'
import {
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
  useAppBoundReset,
} from './windowUtils'
import { Response, getInlineSuggestionsComponent } from './spotlight'
import Measure, { ContentRect } from 'react-measure'
import { SearchControl } from './spotlight'
import { exitNormalIcon, minimiseNormalIcon } from './icons'

const exitIcon = exitNormalIcon()
const expandedLauncherWidth = 600

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

const DynamicLogo: React.FC<{
  isMoving: boolean
  active: boolean
}> = ({ isMoving, active }) => (
  <LogoLauncherContainer>
    {isMoving ? (
      <AdaptiveLoader
        size={21}
        speed={isMoving ? 0.8 : 0}
        seperation={1}
        type="secondary"
        active={active}
      />
    ) : (
      <LogoIcon width={1.2} height={1.2} active={active} />
    )}
  </LogoLauncherContainer>
)

export const Launcher: React.FC = () => {
  const [initialBounds, setInitialBounds] = useState<Bounds>()
  const [responseHeight, setResponseHeight] = useState<number>()
  const [isSearchVisible, setIsSearchVisible] = useState<boolean>(false)
  const [isSearchBusy, setIsSearchBusy] = useState<boolean>(false)
  const searchInputRef = useRef<HTMLInputElement>(null)
  const platform = usePlatform()
  const [contacting, response, sendRequest] = useNlpService()

  useAppBoundReset(initialBounds)

  useEffect(() => {
    getCurrentWindowBounds()
      .then(setInitialBounds)
      .catch(console.error)
  }, [])

  useEffect(() => {
    if (initialBounds) {
      if (isSearchVisible) {
        searchInputRef.current && searchInputRef.current.focus({ preventScroll: true })

        animateCurrentWindowSize({
          ...initialBounds,
          width: expandedLauncherWidth,
          height: responseHeight ? responseHeight + initialBounds.height : initialBounds.height,
        })

        return
      }

      animateCurrentWindowSize(initialBounds)
    }
  }, [isSearchVisible, initialBounds, responseHeight])

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

  const showSearch = useCallback(() => {
    setIsSearchVisible(!isSearchVisible)
  }, [isSearchVisible])

  const handleSearchStateChange = useCallback((isTyping: boolean) => setIsSearchBusy(isTyping), [])

  const handleSearchSizeChange = useCallback(
    (contentRect: ContentRect) => {
      if (contentRect.bounds && contentRect.bounds.height !== responseHeight) {
        setResponseHeight(contentRect.bounds.height)
      }
    },
    [responseHeight],
  )

  const showResponsePanel = useMemo(() => Boolean(isSearchVisible && response), [
    response,
    isSearchVisible,
  ])

  return (
    <RootLauncherContainer>
      <LauncherContainer showResponsePanel={showResponsePanel}>
        <LauncherGlobalStyle />
        <DynamicLogo isMoving={isSearchBusy || contacting} active={isSearchVisible} />
        <LauncherApps />
        <SearchControl
          ref={searchInputRef}
          onStateChange={handleSearchStateChange}
          response={response}
          sendRequest={sendRequest}
          platform={platform}
          isSearchVisible={isSearchVisible}
        />
        <SearchButton onClick={showSearch} isSearchVisible={isSearchVisible} />
        <MinExitContainer>
          <LauncherMinimiseAndExit />
        </MinExitContainer>
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
