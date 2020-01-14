import React, {
  ChangeEvent,
  FocusEventHandler,
  KeyboardEventHandler,
  useCallback,
  useEffect,
  useState,
} from 'react'
import throttle from 'lodash/throttle'
import debounce from 'lodash/debounce'
import { Input, Response, SearchContainer } from './styles'
import { usePlatform } from 'rt-platforms'
import { handleIntent } from 'rt-interop'
import { useNlpService } from './useNlpService'
import { getInlineSuggestionsComponent } from './getInlineSuggestionsComponent'

export type SearchState = {
  loading: boolean
  typing: boolean
}

export interface SearchControlsProps {
  onStateChange: (state: SearchState) => void
}

export const SearchControl = React.forwardRef<HTMLInputElement, SearchControlsProps>(
  ({ onStateChange }, ref) => {
    const [isTyping, setIsTyping] = useState(false)
    const platform = usePlatform()
    const [contacting, response, sendRequest] = useNlpService()

    useEffect(() => {
      onStateChange({
        loading: contacting,
        typing: isTyping,
      })
    }, [contacting, isTyping, onStateChange])

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
        // don't send requests on each keystroke - send the last one in given 250ms
        throttledSendRequest(e.target.value)
      },
      [throttledSendRequest, debouncedStopTyping],
    )

    return (
      <SearchContainer>
        <Input
          onChange={handleChange}
          ref={ref}
          onFocus={handleFocus}
          onKeyDown={handleOnKeyDown}
        />

        {response && (
          <Response>{response && getInlineSuggestionsComponent(response, platform)}</Response>
        )}
      </SearchContainer>
    )
  },
)
