import React, {
  ChangeEvent,
  FocusEventHandler,
  KeyboardEventHandler,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react'
import { DetectIntentResponse } from 'dialogflow'
import throttle from 'lodash/throttle'
import debounce from 'lodash/debounce'
import { Platform } from 'rt-platforms'
import { handleIntent } from 'rt-interop'
import { Input, SearchContainer, CancelButton } from './styles'
import { ExitIcon } from '../../icons'
// import { getInlineTradeExecutionComponent } from './getInlineSuggestionsComponent'

export interface SearchControlsProps {
  onStateChange: (isTyping: boolean) => void
  response: DetectIntentResponse | undefined
  sendRequest: (requestString: string) => void
  platform: Platform
  isSearchVisible: boolean
  resetResponse: () => void
  handleSearchInput: (searchValue: string) => void
  handleClearSearchInput: () => void
  searchInput: string
}

export const SearchControl = React.forwardRef<HTMLInputElement, SearchControlsProps>(
  (
    {
      onStateChange,
      response,
      sendRequest,
      platform,
      isSearchVisible,
      resetResponse,
      handleClearSearchInput,
      handleSearchInput,
      searchInput,
    },
    ref
  ) => {
    const [isTyping, setIsTyping] = useState(false)
    // const [inputValue, setInputValue] = useState('')

    useEffect(() => {
      onStateChange(isTyping)
    }, [isTyping, onStateChange])

    useEffect(() => {
      if (searchInput === '' && !isTyping) {
        resetResponse()
      }
    }, [searchInput, isTyping, resetResponse])

    const handleOnKeyDown: KeyboardEventHandler<HTMLInputElement> = useCallback(
      e => {
        if (e.key === 'Enter' && response) {
          handleIntent(response, platform)
        }
      },
      [response, platform]
    )

    const handleFocus: FocusEventHandler<HTMLInputElement> = useCallback(e => {
      e.currentTarget.setSelectionRange(0, e.currentTarget.value.length)
    }, [])

    const handleBlur: FocusEventHandler<HTMLInputElement> = useCallback(
      e => {
        if (isSearchVisible) {
          e.target.focus({ preventScroll: true })
        }
      },
      [isSearchVisible]
    )

    const handleCancelButtonClick = useCallback(() => {
      handleClearSearchInput()
      resetResponse()
      // eslint-disable-next-line
    }, [])

    const throttledSendRequest = useMemo(
      () =>
        throttle((requestString: string) => sendRequest(requestString), 250, {
          leading: false,
          trailing: true,
        }),
      [sendRequest]
    )

    // if not called again within 350ms, set isTyping to false
    const debouncedStopTyping = useCallback(
      () =>
        debounce(() => setIsTyping(false), 300, {
          leading: false,
          trailing: true,
        }),
      []
    )

    const handleChange = useCallback(
      (e: ChangeEvent<HTMLInputElement>) => {
        setIsTyping(true)
        // when typing stops, we want to change the state after a bit of delay
        debouncedStopTyping()

        handleSearchInput(e.target.value)
      },
      [debouncedStopTyping, handleSearchInput]
    )

    useEffect(() => {
      // don't send requests on each keystroke - send the last one in given 250ms
      throttledSendRequest(searchInput)
    }, [throttledSendRequest, searchInput])

    // const inlineTradeExecutionComponent = response
    //   ? getInlineTradeExecutionComponent(response, handleCancelButtonClick)
    //   : null

    return (
      <SearchContainer className={isSearchVisible ? 'search-container--active' : ''}>
        <Input
          value={searchInput}
          onChange={handleChange}
          ref={ref}
          onFocus={handleFocus}
          onBlur={handleBlur}
          onKeyDown={handleOnKeyDown}
          placeholder="Type something"
        />

        {searchInput && (
          <CancelButton onClick={handleCancelButtonClick}>
            <ExitIcon />
          </CancelButton>
        )}
      </SearchContainer>
    )
  }
)
