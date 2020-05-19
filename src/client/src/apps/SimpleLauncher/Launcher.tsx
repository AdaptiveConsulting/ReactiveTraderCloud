import React, { useCallback, useEffect, useRef, useState, useMemo } from 'react'
import Measure, { ContentRect } from 'react-measure'
import { Bounds } from 'openfin/_v2/shapes'
import { usePlatform } from 'rt-platforms'
import { LaunchButton } from './LaunchButton'
import { LauncherApps } from './LauncherApps'
import {
  LauncherGlobalStyle,
  MinExitContainer,
  ExitButton,
  MinimiseButton,
  LogoLauncherContainer,
  RootLauncherContainer,
  LauncherContainer,
  SearchButtonContainer,
  RootResultsContainer
} from './styles'
import {
  animateCurrentWindowSize,
  closeCurrentWindow,
  getCurrentWindowBounds,
  minimiseCurrentWindow,
  useAppBoundReset
} from './windowUtils'
import { SearchControl, Response, getInlineSuggestionsComponent, useNlpService } from './spotlight'
import { ExitIcon, minimiseNormalIcon, SearchIcon } from './icons'
import { AdaptiveLoader, LogoIcon } from 'rt-components'

const expandedLauncherWidth = 600

const LauncherMinimiseAndExit: React.FC = () => (
  <>
    <ExitButton onClick={closeCurrentWindow}>
      <ExitIcon />
    </ExitButton>
    <MinimiseButton onClick={minimiseCurrentWindow}>{minimiseNormalIcon}</MinimiseButton>
  </>
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

const Logo: React.FC<{
  isMoving: boolean
  active: boolean
}> = ({ isMoving, active }) => (
  <LogoLauncherContainer>
    {isMoving ? (
      <AdaptiveLoader size={21} speed={isMoving ? 0.8 : 0} seperation={1} type="secondary" />
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
  const [contacting, response, sendRequest, resetResponse] = useNlpService()

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
          height: responseHeight ? responseHeight + initialBounds.height : initialBounds.height
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
    [responseHeight]
  )

  const showResponsePanel = useMemo(() => Boolean(isSearchVisible && response), [
    response,
    isSearchVisible
  ])

  return (
    <RootLauncherContainer>
      <LauncherContainer showResponsePanel={showResponsePanel}>
        <LauncherGlobalStyle />
        <Logo isMoving={isSearchBusy || contacting} active={isSearchVisible} />
        <LauncherApps />
        <SearchControl
          ref={searchInputRef}
          onStateChange={handleSearchStateChange}
          response={response}
          sendRequest={sendRequest}
          platform={platform}
          isSearchVisible={isSearchVisible}
          resetResponse={resetResponse}
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
