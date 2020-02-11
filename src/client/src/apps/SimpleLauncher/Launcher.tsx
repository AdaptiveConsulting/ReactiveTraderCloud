import React, { useCallback, useEffect, useRef, useState } from 'react'
import { LaunchButton } from './LaunchButton'
import { LauncherApps } from './LauncherApps'
import { AdaptiveLoader, LogoIcon } from 'rt-components'
import { Bounds } from 'openfin/_v2/shapes'
import SearchIcon from './icons/searchIcon'
import {
  ButtonContainer,
  HorizontalContainer,
  LauncherGlobalStyle,
  LogoContainer,
  RootContainer,
  MinExitContainer,
  ExitButton,
  MinimiseButton,
} from './styles'
import {
  animateCurrentWindowSize,
  closeCurrentWindow,
  getCurrentWindowBounds,
  minimiseCurrentWindow,
} from './windowUtils'
import Measure, { ContentRect } from 'react-measure'
import { SearchControl, SearchState } from './spotlight'
import { exitNormalIcon, minimiseNormalIcon } from './icons'

const LauncherMinimiseAndExit: React.FC = () => (
  <>
    <ExitButton onClick={closeCurrentWindow}>{exitNormalIcon}</ExitButton>
    <MinimiseButton onClick={minimiseCurrentWindow}>{minimiseNormalIcon}</MinimiseButton>
  </>
)

const SearchButton: React.FC<{ onClick: () => void }> = ({ onClick }) => (
  <ButtonContainer>
    <LaunchButton onClick={onClick}>{SearchIcon}</LaunchButton>
  </ButtonContainer>
)

const DynamicLogo: React.FC<{ isMoving: boolean }> = ({ isMoving }) => (
  <LogoContainer>
    {isMoving ? (
      <AdaptiveLoader size={23} speed={isMoving ? 0.8 : 0} seperation={1} type="secondary" />
    ) : (
      <LogoIcon width={1.4} height={1.4} />
    )}
  </LogoContainer>
)

export const Launcher: React.FC = () => {
  const [initialBounds, setInitialBounds] = useState<Bounds>()
  const [isSearchVisible, setIsSearchVisible] = useState<boolean>(false)
  const [isSearchBusy, setIsSearchBusy] = useState<boolean>(false)
  const searchInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    getCurrentWindowBounds()
      .then(setInitialBounds)
      .catch(console.error)
  }, [])

  const showSearch = useCallback(() => {
    if (isSearchVisible) {
      searchInputRef.current && searchInputRef.current.focus({ preventScroll: true })
    }
    setIsSearchVisible(true)
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

  const handleSearchStateChange = useCallback(
    (state: SearchState) => setIsSearchBusy(state.typing || state.loading),
    [],
  )

  const handleSearchSizeChange = useCallback(
    (contentRect: ContentRect) => {
      if (!initialBounds) {
        return
      }
      animateCurrentWindowSize({
        ...initialBounds,
        height: initialBounds.height + (contentRect.bounds ? contentRect.bounds.height : 0),
      })
    },
    [initialBounds],
  )

  return (
    <RootContainer>
      <LauncherGlobalStyle />
      <HorizontalContainer>
        <DynamicLogo isMoving={isSearchBusy} />
        <SearchButton onClick={showSearch} />
        <LauncherApps />
        <MinExitContainer>
          <LauncherMinimiseAndExit />
        </MinExitContainer>
      </HorizontalContainer>

      <Measure bounds onResize={handleSearchSizeChange}>
        {({ measureRef }) => (
          <div ref={measureRef}>
            {isSearchVisible && (
              <SearchControl ref={searchInputRef} onStateChange={handleSearchStateChange} />
            )}
          </div>
        )}
      </Measure>
    </RootContainer>
  )
}
