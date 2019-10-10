import React, { FC, KeyboardEventHandler, useReducer, ChangeEventHandler } from 'react'
import { styled } from 'rt-theme'
import { AdaptiveLoader } from 'rt-components'
import { reducer, initialState } from './reducer'

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

export const Spotlight: FC = () => {
  const [{ request, response, contacting }, dispatch] = useReducer(reducer, initialState)

  const handleChange: ChangeEventHandler<HTMLInputElement> = e => {
    dispatch({ type: 'SET_REQUEST', request: e.target.value })
  }

  const handleOnKeyDown: KeyboardEventHandler<HTMLInputElement> = e => {
    switch (e.key) {
      case 'Enter':
        const value = e.currentTarget.value
        dispatch({ type: 'SEND_REQUEST', request: value })
        setTimeout(
          () => dispatch({ type: 'RECEIVE_RESPONSE', response: `I heard "${value}".` }),
          500,
        )
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
