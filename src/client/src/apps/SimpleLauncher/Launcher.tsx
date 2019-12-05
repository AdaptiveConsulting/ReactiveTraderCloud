import React, { useCallback, useEffect, useRef, useState } from 'react'
import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSignOutAlt } from '@fortawesome/free-solid-svg-icons'
import { LaunchButton } from './LaunchButton'
import { LauncherApps } from './LauncherApps'
import { AdaptiveLoader, LogoIcon } from 'rt-components'
import { ThemeStorageSwitch } from 'rt-theme'
import { Bounds } from 'openfin/_v2/shapes'
import SearchIcon from './icons/searchIcon'
import {
  ButtonContainer,
  HorizontalContainer,
  IconTitle,
  LauncherGlobalStyle,
  LogoContainer,
  RootContainer,
  ThemeSwitchContainer
} from './styles'
import { animateCurrentWindowSize, closeCurrentWindow, getCurrentWindowBounds } from './windowUtils';
import Measure, { ContentRect } from 'react-measure'
import { SearchControl, SearchState } from './spotlight';

library.add(faSignOutAlt)

const LauncherExit: React.FC = () => (
  <ButtonContainer key="exit">
    <LaunchButton onClick={closeCurrentWindow}>
      <FontAwesomeIcon icon="sign-out-alt"/>
      <IconTitle>Exit</IconTitle>
    </LaunchButton>
  </ButtonContainer>
)

const SearchButton: React.FC<{ onClick: () => void }> = ({ onClick }) => (
  <ButtonContainer>
    <LaunchButton onClick={onClick}>{SearchIcon}</LaunchButton>
  </ButtonContainer>
)

const DynamicLogo: React.FC<{ isMoving: boolean }> = ({ isMoving }) => (
  <LogoContainer>
    {
      isMoving ?
        <AdaptiveLoader size={23} speed={isMoving ? 0.8 : 0} seperation={1} type="secondary"/> :
        <LogoIcon width={1.4} height={1.4}/>
    }
  </LogoContainer>
)

export const Launcher: React.FC = () => {
  const [initialBounds, setInitialBounds] = useState<Bounds>()
  const [isSearchVisible, setIsSearchVisible] = useState<boolean>(false)
  const [isSearchBusy, setIsSearchBusy] = useState<boolean>(false)
  const searchInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    getCurrentWindowBounds().then(setInitialBounds)
  }, [])

  const showSearch = useCallback(
    () => {
      if (isSearchVisible) {
        searchInputRef.current && searchInputRef.current.focus({ preventScroll: true })
      }
      setIsSearchVisible(true)
    },
    [isSearchVisible]
  );

  // if search is made visible - focus on it
  useEffect(
    () => {
      if (isSearchVisible) {
        searchInputRef.current && searchInputRef.current.focus({ preventScroll: true })
      }
    },
    [isSearchVisible]
  )

  // hide search if Escape is pressed
  useEffect(
    () => {
      const onKeyDown = (event: KeyboardEvent) => {
        if (event.key === 'Escape') {
          setIsSearchVisible(false)
        }
      }
      document.addEventListener('keydown', onKeyDown)
      return () => document.removeEventListener('keydown', onKeyDown)
    }, []
  )

  const handleSearchStateChange = useCallback(
    (state: SearchState) => setIsSearchBusy(state.typing || state.loading),
    []
  )

  const handleSearchSizeChange = useCallback(
    (contentRect: ContentRect) => {
      if (!initialBounds) {
        return
      }
      animateCurrentWindowSize({
        ...initialBounds,
        height: initialBounds.height + (contentRect.bounds ? contentRect.bounds.height : 0)
      })
    },
    [initialBounds]
  )

  return (
    <RootContainer>
      <LauncherGlobalStyle/>
      <HorizontalContainer>
        <DynamicLogo isMoving={isSearchBusy}/>
        {/* TODO: enable in production when we are ready */}
        {process.env.NODE_ENV === 'development' ? <SearchButton onClick={showSearch}/> : null}
        <LauncherApps/>
        <LauncherExit/>
        <ThemeSwitchContainer>
          <ThemeStorageSwitch/>
        </ThemeSwitchContainer>
      </HorizontalContainer>

      <Measure
        bounds
        onResize={handleSearchSizeChange}>
        {({ measureRef }) => (
          <div ref={measureRef}>
            {isSearchVisible && (
              <SearchControl
                ref={searchInputRef}
                onStateChange={handleSearchStateChange}/>
            )}
          </div>
        )}
      </Measure>

    </RootContainer>
  )
}
