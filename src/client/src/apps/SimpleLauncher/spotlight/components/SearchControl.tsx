import React, {
  ChangeEvent,
  FocusEventHandler,
  KeyboardEventHandler,
  useCallback,
  useEffect,
  useState,
} from 'react'
import { DetectIntentResponse } from 'dialogflow'
import throttle from 'lodash/throttle'
import debounce from 'lodash/debounce'
import { Platform } from 'rt-platforms'
import { handleIntent } from 'rt-interop'
import { Input, SearchContainer, CancelButton } from './styles'
import { exitNormalIcon } from '../../icons'

export interface SearchControlsProps {
  onStateChange: (isTyping: boolean) => void
  response: DetectIntentResponse | undefined
  sendRequest: (requestString: string) => void
  platform: Platform
  isSearchVisible: boolean
}

const cancelIcon = exitNormalIcon('#FFFFFF')

export const SearchControl = React.forwardRef<HTMLInputElement, SearchControlsProps>(
  ({ onStateChange, response, sendRequest, platform, isSearchVisible }, ref) => {
    const [isTyping, setIsTyping] = useState(false)
    const [inputValue, setInputValue] = useState('')

    useEffect(() => {
      onStateChange(isTyping)
    }, [isTyping, onStateChange])

    const handleOnKeyDown: KeyboardEventHandler<HTMLInputElement> = useCallback(
      e => {
        if (e.key === 'Enter' && response) {
          handleIntent(response, platform)
        }
      },
      [response, platform],
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
      [isSearchVisible],
    )

    const handleCancelButtonClick = useCallback(() => {
      setInputValue('')
    }, [])

    const throttledSendRequest = useCallback(
      throttle((requestString: string) => sendRequest(requestString), 250, {
        leading: false,
        trailing: true,
      }),
      [],
    )

    // if not called again within 350ms, set isTyping to false
    const debouncedStopTyping = useCallback(
      debounce(() => setIsTyping(false), 350, {
        leading: false,
        trailing: true,
      }),
      [],
    )

    const handleChange = useCallback(
      (e: ChangeEvent<HTMLInputElement>) => {
        setIsTyping(true)
        // when typing stops, we want to change the state after a bit of delay
        debouncedStopTyping()

        setInputValue(e.target.value)
      },
      [debouncedStopTyping],
    )

    useEffect(() => {
      // don't send requests on each keystroke - send the last one in given 250ms
      throttledSendRequest(inputValue)
    }, [throttledSendRequest, inputValue])

    return (
      <SearchContainer className={isSearchVisible ? 'search-container--active' : ''}>
        <Input
          value={inputValue}
          onChange={handleChange}
          ref={ref}
          onFocus={handleFocus}
          onBlur={handleBlur}
          onKeyDown={handleOnKeyDown}
          placeholder="Type something"
        />
        {inputValue && <CancelButton onClick={handleCancelButtonClick}>{cancelIcon}</CancelButton>}
      </SearchContainer>
    )
  },
)
