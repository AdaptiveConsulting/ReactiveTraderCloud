import React, { FC, KeyboardEventHandler, useReducer, ChangeEventHandler } from 'react'
import { styled } from 'rt-theme'
import { AdaptiveLoader } from 'rt-components'
import { reducer, initialState } from './reducer'
import { useServiceStub } from './hooks'
import { AutobahnConnectionProxy } from 'rt-system'
import { take, timeout } from 'rxjs/operators'
import { mapIntent } from './responseMapper'

const Container = styled.div`
  color: ${({ theme }) => theme.core.textColor};
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

const Contacting = styled.span`
  margin-left: 0.5rem;
`

const INPUT_ID = 'spotlight'

const autobahn = new AutobahnConnectionProxy(
  process.env.REACT_APP_BROKER_HOST || location.hostname,
  'com.weareadaptive.reactivetrader',
  +(process.env.REACT_APP_BROKER_PORT || location.port),
);

export const Spotlight: FC = () => {
  const [{ request, response, contacting }, dispatch] = useReducer(reducer, initialState)
  const {serviceStub} = useServiceStub(autobahn);

  const handleChange: ChangeEventHandler<HTMLInputElement> = e => {
    dispatch({ type: 'SET_REQUEST', request: e.target.value })
  }

  const handleOnKeyDown: KeyboardEventHandler<HTMLInputElement> = e => {
    switch (e.key) {
      case 'Enter':
        const value = e.currentTarget.value
        dispatch({ type: 'SEND_REQUEST', request: value })
        serviceStub.createRequestResponseOperation('nlp', 'getNlpIntent', value)
          .pipe(
            timeout(5000),
            take(1)
          )
          .subscribe((response: any) => {
            const result = mapIntent(response);
            dispatch({ type: 'RECEIVE_RESPONSE', response: `I heard "${result}".` })
          }, () => {
            dispatch({ type: 'RECEIVE_RESPONSE', response: `Oops. I didn't hear anything.` });
          })
        break
      case 'ArrowDown':
        e.preventDefault()
        dispatch({ type: 'HISTORY_NEXT' })
        break
      case 'ArrowUp':
        e.preventDefault()
        dispatch({ type: 'HISTORY_PREVIOUS' })
        break
    }
  }

  return (
    <Container>
      <Prompt htmlFor={INPUT_ID}>Hello Spotlight</Prompt>
      <Input
        id={INPUT_ID}
        autoFocus
        value={request}
        onChange={handleChange}
        onKeyDown={handleOnKeyDown}
      />
      <Response>
        {contacting ? (
          <>
            <AdaptiveLoader size={14} speed={0.8} seperation={1.5} type="secondary" />
            <Contacting>Contacting…</Contacting>
          </>
        ) : (
          response
        )}
      </Response>
    </Container>
  )
}
