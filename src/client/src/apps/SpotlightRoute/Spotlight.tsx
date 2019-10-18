import React, { ChangeEventHandler, FC, FocusEventHandler, KeyboardEventHandler, useEffect, useReducer } from 'react'
import { styled } from 'rt-theme'
import { AdaptiveLoader } from 'rt-components'
import { initialState, reducer } from './reducer'
import { useServiceStub } from './context'
import { take, tap, timeout } from 'rxjs/operators'
import { DetectIntentResponse } from 'dialogflow'
import { PlatformAdapter, usePlatform } from 'rt-platforms'
import { getCurrency, getCurrencyPair, getNumber, handleIntent } from './handleIntent'
import { isSpotQuoteIntent, isTradeIntent, mapIntent } from './responseMapper'
import { InlineQuote } from './InlineQuote'
import { InlineBlotter } from './InlineBlotter'

const Container = styled.div`
  color: ${({theme}) => theme.core.textColor};
  display: flex;
  flex-flow: column nowrap;
  padding: 1rem;
  max-width: 80rem;
  align-items: stretch;
`

const Prompt = styled.label`
  font-size: 0.75rem;
  opacity: 0.59;
  margin: 0 0 0.5rem;
`

const Input = styled.input`
  background: none;
  outline: none;
  border: none;
  font-size: 1.25rem;
  padding: 2px 0;
`

const Response = styled.div`
  font-size: 1rem;
  font-style: italic;
  opacity: 0.59;
  margin: 0.5rem 0 0;
`

const Suggestion = styled.div`
  padding: 10px 5px;
  line-height: 1rem;
  cursor: pointer;
  background-color: ${({theme}) => theme.core.lightBackground};
  &:hover {
    background-color: ${({theme}) => theme.core.backgroundHoverColor};
  }
`

const Contacting = styled.span`
  margin-left: 0.5rem;
`

const INPUT_ID = 'spotlight'

function getSuggestionsComponent(response: DetectIntentResponse, platform: PlatformAdapter, intent: string) {
  const currencyPair = getCurrencyPair(response.queryResult)
  const currency = getCurrency(response.queryResult)

  return (
    <>
      <Suggestion onClick={() => handleIntent(response, platform)}>
        {intent}
      </Suggestion>
      {isSpotQuoteIntent(response)
        ? (
          <Suggestion onClick={() => handleIntent(response, platform)}>
            <InlineQuote currencyPair={currencyPair}/>
          </Suggestion>
        )
        : null
      }
      {isTradeIntent(response)
        ? (
          <Suggestion onClick={() => handleIntent(response, platform)}>
            <InlineBlotter
              filters={{dealtCurrency: [currency], symbol: [currencyPair]}}
              count={getNumber(response.queryResult)}/>
          </Suggestion>
        )
        : null
      }
    </>
  );
}

export const Spotlight: FC = () => {
  const [{request, response, contacting}, dispatch] = useReducer(reducer, initialState)
  const serviceStub = useServiceStub()
  const platform = usePlatform()

  useEffect(() => {
    if (!contacting) {
      return;
    }
    const subscription = serviceStub
      .createRequestResponseOperation<DetectIntentResponse[], string>(
        'nlp',
        'getNlpIntent',
        request,
      )
      .pipe(
        tap(() => console.info(JSON.stringify(request))),
        timeout(10000),
        take(1),
      )
      .subscribe(
        response => {
          dispatch({type: 'RECEIVE_RESPONSE', response: response[0]})
        },
        (err: any) => {
          console.error(err)
          dispatch({type: 'RECEIVE_RESPONSE', response: null})
        },
      )

    return () => {
      subscription.unsubscribe()
    }
    // Only trigger nlp call when contacting goes to 'true'.
    // The request variable is updated on every input change, hence why we remove it from the list of deps below
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [contacting, serviceStub])

  const handleChange: ChangeEventHandler<HTMLInputElement> = e => {
    dispatch({type: 'SET_REQUEST', request: e.target.value})
  }

  const handleOnKeyDown: KeyboardEventHandler<HTMLInputElement> = e => {
    switch (e.key) {
      case 'Enter':
        const value = e.currentTarget.value
        dispatch({type: 'SEND_REQUEST', request: value})
        break
      case 'ArrowDown':
        e.preventDefault()
        dispatch({type: 'HISTORY_NEXT'})
        break
      case 'ArrowUp':
        e.preventDefault()
        dispatch({type: 'HISTORY_PREVIOUS'})
        break
    }
  }

  const handleFocus: FocusEventHandler<HTMLInputElement> = e => {
    e.currentTarget.setSelectionRange(0, e.currentTarget.value.length);
  }

  const intent = mapIntent(response)

  const loader = (
    <>
      <AdaptiveLoader size={14} speed={0.8} seperation={1.5} type="secondary"/>
      <Contacting>Contacting…</Contacting>
    </>
  )

  const suggestions = intent && response && getSuggestionsComponent(response, platform, intent)

  return (
    <Container>
      <Prompt htmlFor={INPUT_ID}>Hello Spotlight</Prompt>
      <Input
        id={INPUT_ID}
        autoFocus
        value={request}
        onFocus={handleFocus}
        onChange={handleChange}
        onKeyDown={handleOnKeyDown}
      />
      <Response>{contacting ? loader : suggestions}</Response>
    </Container>
  )
}
