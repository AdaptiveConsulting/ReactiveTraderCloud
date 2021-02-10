import React, { useCallback, useEffect, useRef, useState, useMemo } from 'react'
import Measure, { ContentRect } from 'react-measure'
import { Bounds } from 'openfin/_v2/shapes/shapes'
import { handleIntent } from 'rt-interop'
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
  RootResultsContainer,
} from './styles'
import {
  animateCurrentWindowSize,
  closeCurrentWindow,
  getCurrentWindowBounds,
  minimiseCurrentWindow,
  useAppBoundReset,
} from './windowUtils'
import { SearchControl, Response, getInlineSuggestionsComponent, useNlpService } from './spotlight'
import { ExitIcon, minimiseNormalIcon, SearchIcon } from './icons'
import { AdaptiveLoader, LogoIcon } from 'rt-components'
import { InlineTradeExecution } from './spotlight/components/InlineTradeExecution'
import { isTradeExecutionIntent } from 'rt-interop'

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
  const [searchValue, setSearchValue] = useState('')
  const [showTradeExecutionFlow, setShowTradeExecutionFlow] = useState(false)

  const handleResolvedIntent = () => {
    if (response && platform) {
      if (isTradeExecutionIntent(response)) {
        setShowTradeExecutionFlow(true)
      } else {
        handleIntent(response, platform)
      }
    }
  }

  useAppBoundReset(initialBounds)

  useEffect(() => {
    getCurrentWindowBounds().then(setInitialBounds).catch(console.error)
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
        if (!response || !isTradeExecutionIntent(response)) {
          setIsSearchVisible(false)
        }
      }
    }
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [response])

  const handleSearchInput = (value: string) => {
    setSearchValue(value)
  }

  const handleClearSeachInput = () => {
    setSearchValue('')
  }

  const showSearch = useCallback(() => {
    setIsSearchVisible(!isSearchVisible)
  }, [isSearchVisible])

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
    isSearchVisible,
  ])

  const inlineSuggestions =
    response && isSearchVisible ? getInlineSuggestionsComponent(response, platform) : null

  return (
    <RootLauncherContainer>
      <LauncherContainer showResponsePanel={showResponsePanel}>
        <LauncherGlobalStyle />
        <Logo isMoving={isSearchBusy || contacting} active={isSearchVisible} />
        <LauncherApps />
        <SearchControl
          ref={searchInputRef}
          onStateChange={setIsSearchBusy}
          onSubmit={handleResolvedIntent}
          response={response}
          sendRequest={sendRequest}
          isSearchVisible={isSearchVisible}
          resetResponse={resetResponse}
          handleSearchInput={handleSearchInput}
          handleClearSearchInput={handleClearSeachInput}
          searchInput={searchValue}
        />
        <SearchButton onClick={showSearch} isSearchVisible={isSearchVisible} />

        {response && showTradeExecutionFlow && (
          <InlineTradeExecution
            response={response}
            handleClearSearchInput={handleClearSeachInput}
            handleReset={() => {
              setShowTradeExecutionFlow(false)
              resetResponse()
            }}
          />
        )}

        <MinExitContainer>
          <LauncherMinimiseAndExit />
        </MinExitContainer>
      </LauncherContainer>
      <Measure bounds onResize={handleSearchSizeChange}>
        {({ measureRef }) => (
          <div ref={measureRef}>
            {inlineSuggestions && !showTradeExecutionFlow && (
              <RootResultsContainer>
                <Response>{inlineSuggestions}</Response>
              </RootResultsContainer>
            )}
          </div>
        )}
      </Measure>
    </RootLauncherContainer>
  )
}
